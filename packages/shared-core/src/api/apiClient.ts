import { AuthEndpoints } from '@auraflux/shared-core/api/endpoints';
import axios from 'axios';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';

import type { FailedRequestQueueItem, ProcessQueueItem } from '@auraflux/shared-core/interfaces/api';
import type { TokenInfo } from '@auraflux/shared-core/interfaces/user';

/**
 * This module sets up an Axios instance (`apiClient`) with interceptors to handle:
 * 1. Attaching the appropriate Authorization header for service requests.
 */

export const apiClient = axios.create({
  // **Crucial for JWT Cookie Auth**
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * The request interceptor's role is to intercept outgoing HTTP requests before they are sent.
 * It checks if the request requires a service token (based on the `serviceScope` property).
 * If a service token is needed, it ensures that the token is valid and not expired.
 * If the token is expired or missing, it fetches a new token from the server.
 * Once a valid token is obtained, it attaches the token to the request's Authorization header.
 */

async function checkOrRefreshTokenBeforeRequest(scope?: string): Promise<TokenInfo> {
  const authStore = useAuthStore();

  if (!scope) {
    throw new Error('Service name is required for token management');
  }

  if (await authStore.isServiceTokenExpired(scope)) {
    await authStore.fetchServiceToken(scope);
  }

  return authStore.accessTokens[scope];
}

apiClient.interceptors.request.use(
  async (config) => {
    const scope = config.serviceScope;
    if (!scope) return config;

    const token = await checkOrRefreshTokenBeforeRequest(scope);

    if (token?.token) {
      config.headers['Authorization'] = `${token.token_type} ${token.token}`.trim();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * The response interceptor's role is to handle incoming HTTP responses.
 * It checks for 401 Unauthorized errors, which indicate that the Access Token has expired.
 * If a 401 error is detected, it attempts to refresh the Access Token using the Refresh Token (stored in an HTTP-only cookie).
 * If the refresh is successful, it retries the original request with the new Access Token.
 * If the refresh fails (e.g., the Refresh Token is also expired), it logs out the user or redirects them to the login page.
 */

let isRefreshing = false; // Flag to prevent multiple simultaneous refresh calls
let failedQueue: FailedRequestQueueItem[] = [];   // Queue for failed requests

// Helper function to process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null): void => {
  (failedQueue as ProcessQueueItem[]).forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark the original request for retry
      originalRequest._retry = true;

      // If a refresh is already in progress, queue the request
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
          // Re-issue the original request (it will now carry the new cookie)
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      // 🚨 Start the token refresh process
      isRefreshing = true;

      try {
        // Send a request to the server's refresh endpoint.
        // The HTTP-only Refresh Token cookie is sent automatically.
        const response = await axios.post(AuthEndpoints.users.refreshToken(), null, {
          withCredentials: true,
        });

        // Backend should respond with 200 and set new HTTP-only cookies
        // (New Access Token and optionally a new Refresh Token)

        isRefreshing = false;
        processQueue(null); // Process all queued requests

        // Re-issue the original request with the new Access Token cookie
        return apiClient(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as Error); // Reject all queued requests

        // Log out the user or redirect to the login page
        // You would typically use a Vue Router/State/Pinia action here
        console.error("Token refresh failed. Redirecting to login.");
        // Example: router.push('/login');

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (400, 403, 500, etc.), reject the promise
    return Promise.reject(error);
  }
);

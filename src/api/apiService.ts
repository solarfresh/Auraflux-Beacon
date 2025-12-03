import { SearchEndpoints, UsersEndpoints, WorkflowsEndpoints } from '@/api/endpoints';
import type { FailedRequestQueueItem, ProcessQueueItem } from '@/interfaces/api';
import { SearchResult } from '@/interfaces/search';
import type { User } from '@/interfaces/user';
import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  // **Crucial for JWT Cookie Auth**
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

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
        const response = await axios.post(UsersEndpoints.refreshToken.create(), null, {
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

export const apiService = {
  search: {
    results: {
      create: (query: string): Promise<AxiosResponse<SearchResult[]>> => {
        return apiClient.post(SearchEndpoints.results.create(), {query: query});
      },
    }
  },
  users: {
    check: {
      get: (): Promise<AxiosResponse<User>> => {
        return apiClient.get(UsersEndpoints.check.get());
      }
    },
    login: {
      create: (username: string, password: string): Promise<AxiosResponse<User>> => {
        return apiClient.post(UsersEndpoints.login.create(), {username: username, password: password});
      },
    },
  },
  workflows: {
    initiation: {
      chat: (message: string): Promise<AxiosResponse> => {
        return apiClient.post(WorkflowsEndpoints.initiation.chat(), {user_message: message})
      }
    }
  }
}
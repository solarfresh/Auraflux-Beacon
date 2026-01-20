import { KnowledgeEndpoints, UsersEndpoints, WorkflowsEndpoints } from '@/api/endpoints';
import type { FailedRequestQueueItem, ProcessQueueItem } from '@/interfaces/api';
import type { ChatMessage } from '@/interfaces/core';
import type { ProcessedKeyword, ProcessedScope, RefinedTopic } from '@/interfaces/initiation';
import type { SidebarRegistryInfo } from '@/interfaces/exploration';
import type { User } from '@/interfaces/user';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
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
  knowledge:{
    keywords: {
      update: (keywordId: string, keywordText: string, keywordStatus: string | null = null): Promise<AxiosResponse<ProcessedKeyword[]>> => {
        return apiClient.put(KnowledgeEndpoints.keywords.update(keywordId), {text: keywordText, status: keywordStatus})
      }
    },
    scopes: {
      update: (scopeId: string, scopeLabel: string, scopeValue: string, scopeStatus: string | null = null): Promise<AxiosResponse<ProcessedScope[]>> => {
        return apiClient.put(KnowledgeEndpoints.scopes.update(scopeId), {label: scopeLabel, value: scopeValue, status: scopeStatus})
      }
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
    base: {
      chat: (messageContent: string, agentName: string): Promise<AxiosResponse> => {
        return apiClient.post(WorkflowsEndpoints.base.chat(), {user_message: messageContent, ea_agent_role_name: agentName})
      },
      getChatHistory: (): Promise<AxiosResponse<ChatMessage[]>> => {
        return apiClient.get(WorkflowsEndpoints.base.getChatHistory())
      },
      createReflectionLog: (logTitle: string, logContent: string, logStatus: string | null = null): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.post(WorkflowsEndpoints.base.createReflectionLog(), {title: logTitle, content: logContent, status: logStatus})
      },
      getReflectionLog: (): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.get(WorkflowsEndpoints.base.getReflectionLog())
      },
      updateReflectionLogById: (logId: string, logTitle: string, logContent: string, logStatus: string | null = null): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.put(WorkflowsEndpoints.base.updateReflectionLogById(logId), {title: logTitle, content: logContent, status: logStatus})
      }
    },
    initiation: {
      getRefinedTopic: (): Promise<AxiosResponse<RefinedTopic>> => {
        return apiClient.get(WorkflowsEndpoints.initiation.getRefinedTopic())
      },
    },
    exploration: {
      getSidebarRegistryInfo:(): Promise<AxiosResponse<SidebarRegistryInfo>> => {
        return apiClient.get(WorkflowsEndpoints.exploration.getSidebarRegistryInfo())
      }
    },
    keywords: {
      create: (keywordText: string, keywordStatus: string | null = null): Promise<AxiosResponse<ProcessedKeyword[]>> => {
        return apiClient.post(WorkflowsEndpoints.keywords.create(), {text: keywordText, status: keywordStatus})
      },
    },
    scopes: {
      create: (scopeLabel: string, scopeValue: string, scopeStatus: string | null = null): Promise<AxiosResponse<ProcessedScope[]>> => {
        return apiClient.post(WorkflowsEndpoints.scopes.create(), {label: scopeLabel, value: scopeValue, status: scopeStatus})
      },
    }
  },
}
import { AgentsEndpoints, CanvasesEndpoints, KnowledgeEndpoints, ProjectsEndpoints, UsersEndpoints } from '@/api/endpoints';
import type { FailedRequestQueueItem, ProcessQueueItem } from '@/interfaces/api';
import type { ConceptualGraph, ConceptualNode } from '@/interfaces/conceptual-map';
import type { ChatMessage } from '@/interfaces/core';
import { ID } from '@/interfaces/core';
import type { Agent, ModelProvider } from '@/interfaces/agents';
import type { SidebarRegistryInfo } from '@/interfaces/exploration';
import type { ProcessedKeyword, ProcessedScope, RefinedTopic } from '@/interfaces/initiation';
import type { Project, ReflectionLogEntry } from '@/interfaces/project';
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
  agents: {
    createModelProvider: (provider: ModelProvider): Promise<AxiosResponse<ModelProvider>> => {
      return apiClient.post(AgentsEndpoints.createModelProvider(), provider);
    },
    getAgents: (): Promise<AxiosResponse<Agent[]>> => {
      return apiClient.get(AgentsEndpoints.getAgents());
    },
    getAgentDetail: (agentId: ID): Promise<AxiosResponse<Agent>> => {
      return apiClient.get(AgentsEndpoints.getAgentDetail(agentId));
    },
    getAvailableModels: (providerType: string, apiKey: string): Promise<AxiosResponse<any>> => {
      return apiClient.post(AgentsEndpoints.getAvailableModels(), {providerType: providerType, apiKey:apiKey})
    },
    getModelProviders: (): Promise<AxiosResponse<ModelProvider[]>> => {
      return apiClient.get(AgentsEndpoints.getModelProviders());
    }
  },
  canvases: {
    graphs: {
      get: (canvasId: ID): Promise<AxiosResponse<ConceptualGraph>> => {
        return apiClient.get(CanvasesEndpoints.graphs.get(canvasId));
      }
    },
    nodes: {
      delete: (canvasId: ID, nodeId: ID) => {
        apiClient.delete(CanvasesEndpoints.nodes.delete(canvasId, nodeId));
      },
      update: (canvasId: ID, nodeId: ID, data: any): Promise<AxiosResponse<ConceptualNode>> => {
        return apiClient.put(CanvasesEndpoints.nodes.delete(canvasId, nodeId), data);
      },
    }
  },
  knowledge:{
    keywords: {
      update: (keywordId: ID, keywordText: string, keywordStatus: string | null = null): Promise<AxiosResponse<ProcessedKeyword[]>> => {
        return apiClient.put(KnowledgeEndpoints.keywords.update(keywordId), {text: keywordText, status: keywordStatus})
      }
    },
    scopes: {
      update: (scopeId: ID, scopeLabel: string, scopeValue: string, scopeStatus: string | null = null): Promise<AxiosResponse<ProcessedScope[]>> => {
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
  projects: {
    base: {
      createReflectionLog: (projectId: ID, logTitle: string, logContent: string, logStatus: string | null = null): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.post(ProjectsEndpoints.base.createReflectionLog(projectId), {title: logTitle, content: logContent, status: logStatus})
      },
      getProject: (): Promise<AxiosResponse<Project[]>> => {
        return apiClient.get(ProjectsEndpoints.base.getProject())
      },
      getProjectDetail: (projectId: ID): Promise<AxiosResponse<Project>> => {
        return apiClient.get(ProjectsEndpoints.base.getProjectDetail(projectId))
      },
      updateProjectDetail: (projectId: ID, data: Partial<Project>): Promise<AxiosResponse<Project>> => {
        return apiClient.put(ProjectsEndpoints.base.updateProjectDetail(projectId), data);
      },
      getReflectionLog: (projectId: ID): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.get(ProjectsEndpoints.base.getReflectionLog(projectId))
      },
      updateReflectionLogById: (logId: ID, logTitle: string, logContent: string, logStatus: string | null = null): Promise<AxiosResponse<ReflectionLogEntry[]>> => {
        return apiClient.put(ProjectsEndpoints.base.updateReflectionLogById(logId), {title: logTitle, content: logContent, status: logStatus})
      }
    },
    initiation: {
      chat: (projectId: ID, messageContent: string, agentName: string): Promise<AxiosResponse> => {
        return apiClient.post(ProjectsEndpoints.initiation.chat(projectId), {user_message: messageContent, ea_agent_role_name: agentName})
      },
      getChatHistory: (projectId: ID): Promise<AxiosResponse<ChatMessage[]>> => {
        return apiClient.get(ProjectsEndpoints.initiation.getChatHistory(projectId))
      },
      getRefinedTopic: (projectId: ID): Promise<AxiosResponse<RefinedTopic>> => {
        return apiClient.get(ProjectsEndpoints.initiation.getRefinedTopic(projectId))
      },
    },
    exploration: {
      createSession: (projectId: ID, stabilityScore: number, finalQuestion: string): Promise<AxiosResponse<any>> => {
        return apiClient.post(ProjectsEndpoints.exploration.createSession(projectId), {stabilityScore: stabilityScore, finalQuestion: finalQuestion})
      },
      getSidebarRegistryInfo: (projectId: ID): Promise<AxiosResponse<SidebarRegistryInfo>> => {
        return apiClient.get(ProjectsEndpoints.exploration.getSidebarRegistryInfo(projectId))
      },
      recommendConceptualNodes: (projectId: ID, canvasId: ID): Promise<AxiosResponse<ConceptualGraph>> => {
        return apiClient.post(ProjectsEndpoints.exploration.recommendConceptualNodes(projectId, canvasId))
      }
    },
    keywords: {
      create: (projectId: ID, keywordText: string, keywordStatus: string | null = null): Promise<AxiosResponse<ProcessedKeyword[]>> => {
        return apiClient.post(ProjectsEndpoints.keywords.create(projectId), {text: keywordText, status: keywordStatus})
      },
    },
    scopes: {
      create: (projectId: ID, scopeLabel: string, scopeValue: string, scopeStatus: string | null = null): Promise<AxiosResponse<ProcessedScope[]>> => {
        return apiClient.post(ProjectsEndpoints.scopes.create(projectId), {label: scopeLabel, value: scopeValue, status: scopeStatus})
      },
    }
  },
}
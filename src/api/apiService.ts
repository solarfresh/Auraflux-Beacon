import axios, { AxiosResponse } from 'axios';
import { SearchAssistant, SearchResult } from '@/interfaces/search';
import type { LoginResponse } from '@/interfaces/user';
import type { WorkflowState } from '@/interfaces/search'
import { SearchEndpoints, UsersEndpoints, WorkflowsEndpoints } from '@/api/endpoints';

const apiClient = axios.create({
  // **Crucial for JWT Cookie Auth**
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  search: {
    assistant: {
      create: (query: string): Promise<AxiosResponse<SearchAssistant>> => {
        return apiClient.post(SearchEndpoints.assistant.create(), {query: query});
      },
    },
    results: {
      create: (query: string): Promise<AxiosResponse<SearchResult[]>> => {
        return apiClient.post(SearchEndpoints.results.create(), {query: query});
      },
    }
  },
  users: {
    login: {
      create: (username: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
        return apiClient.post(UsersEndpoints.login.create(), {username: username, password: password});
      },
    },
  },
  workflows: {
    fetchState: {
      get: (): Promise<AxiosResponse<WorkflowState>> => {
        return apiClient.get(WorkflowsEndpoints.fetchState.get());
      }
    }
  }
}
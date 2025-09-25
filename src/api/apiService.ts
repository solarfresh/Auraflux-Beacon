import axios, { AxiosResponse } from 'axios';
import { SearchAssistant, SearchResult } from '@/interfaces/search'
import { SearchEndpoints } from '@/api/endpoints'


const apiClient = axios.create({
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
  }
}
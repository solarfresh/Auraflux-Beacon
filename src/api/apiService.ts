import axios, { AxiosResponse } from 'axios';
import { AcquisitionEndpoints, CompetitiveAnalysisEndpoints, ProductsEndpoints, VisionEndpoints } from './endpoints';
import { SearchResult } from '@/interfaces/search'
import { SearchEndpoints } from '@/api/endpoints'


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});


export const apiService = {
  search: {
    create: (query: string): Promise<AxiosResponse<SearchResult[]>> => {
      return apiClient.post(SearchEndpoints.create(), {query: query});
    },
  }
}
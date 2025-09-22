import axios, { AxiosResponse } from 'axios';
import { AcquisitionEndpoints, CompetitiveAnalysisEndpoints, ProductsEndpoints, VisionEndpoints } from './endpoints';


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});


export const apiService = {
}
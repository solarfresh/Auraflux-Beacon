import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    serviceScope?: string;
  }
}
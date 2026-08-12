import { MullEndpoints } from '@/api/endpoints';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
// import type { ID } from '@auraflux/design-system/interfaces/core';
import type { Project } from '@/interfaces/project';
import { AxiosResponse } from 'axios';

export const apiService = {
  projects: {
    get: (tag?: string): Promise<AxiosResponse<Project[]>> => {
      return apiClient.get(MullEndpoints.projects.base(), {
        params: {
          ...(tag && { tag })
        }
      });
    },
    create: (payload: Partial<Project>): Promise<AxiosResponse<Project>> => {
      return apiClient.post(MullEndpoints.projects.base(), payload);
    }
  }
}
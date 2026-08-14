import { MullEndpoints } from '@/api/endpoints';
import type { Project } from '@/interfaces/project';
import type { RepositoryFile } from '@/interfaces/repository';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import config from '@auraflux/shared-core/config';
import { AxiosResponse } from 'axios';

const AURAFLUX_MULL_CLIENT_ID = config.AURAFLUX_MULL_CLIENT_ID

export const apiService = {
  projects: {
    get: (tag?: string): Promise<AxiosResponse<Project[]>> => {
      return apiClient.get(MullEndpoints.projects.base(), {
        serviceScope: AURAFLUX_MULL_CLIENT_ID,
        params: {
          ...(tag && { tag })
        }
      });
    },
    create: (payload: Partial<Project>): Promise<AxiosResponse<Project>> => {
      return apiClient.post(MullEndpoints.projects.base(), payload, {
        serviceScope: AURAFLUX_MULL_CLIENT_ID,
      });
    },
    files: {
      upload: (projectId: ID, payload: FormData): Promise<AxiosResponse<RepositoryFile>> => {
        return apiClient.post(MullEndpoints.projects.files(projectId), payload, {
          serviceScope: AURAFLUX_MULL_CLIENT_ID,
        })
      }
    }
  }
}
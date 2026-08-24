import { MullEndpoints } from '@/api/endpoints';
import type { Project } from '@/interfaces/project';
import type { RepositoryFile, RepositoryFileUploadResult } from '@/interfaces/repository';
import type { Agent } from '@auraflux/design-system/interfaces/agents';
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
    agents: {
      get: (projectId: ID): Promise<AxiosResponse<Agent[]>> => {
        return apiClient.get(MullEndpoints.projects.agents.base(projectId), {
          serviceScope: AURAFLUX_MULL_CLIENT_ID,
        })
      },
    },
    files: {
      details: {
        delete: (projectId: ID, fileId: ID): Promise<AxiosResponse<any>> => {
          return apiClient.delete(MullEndpoints.projects.files.details.delete(projectId, fileId), {
            serviceScope: AURAFLUX_MULL_CLIENT_ID,
          });
        }
      },
      get: (projectId: ID): Promise<AxiosResponse<RepositoryFile[]>> => {
        return apiClient.get(MullEndpoints.projects.files.base(projectId), {
          serviceScope: AURAFLUX_MULL_CLIENT_ID,
        })
      },
      upload: (projectId: ID, payload: FormData): Promise<AxiosResponse<RepositoryFileUploadResult>> => {
        return apiClient.post(MullEndpoints.projects.files.base(projectId), payload, {
          serviceScope: AURAFLUX_MULL_CLIENT_ID,
        })
      }
    }
  }
}
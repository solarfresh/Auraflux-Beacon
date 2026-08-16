import type { ModelProvider, ModelProviderForm } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import { AuthEndpoints } from '@auraflux/shared-core/api/endpoints';
import type { TokenInfo, User } from '@auraflux/shared-core/interfaces/user';
import { AxiosResponse } from 'axios';

export const apiService = {
  auth: {
    agents: {
      models: {
        get: (): Promise<AxiosResponse<ModelProvider[]>> => {
          return apiClient.get(AuthEndpoints.agents.models.base());
        },
        create: (payload: ModelProviderForm): Promise<AxiosResponse<ModelProvider>> => {
          return apiClient.post(AuthEndpoints.agents.models.base(), payload);
        },
        available: (providerType: string, apiKey: string, providerId?: ID): Promise<AxiosResponse<any>> => {
          return apiClient.post(AuthEndpoints.agents.models.available(), {providerType: providerType, apiKey:apiKey, providerId: providerId});
        }
      }
    },
    users: {
      check: {
        get: (): Promise<AxiosResponse<User>> => {
          return apiClient.get(AuthEndpoints.users.check());
        }
      },
      login: {
        create: (username: string, password: string): Promise<AxiosResponse<User>> => {
          return apiClient.post(AuthEndpoints.users.login(), {username: username, password: password});
        },
      },
      tokens: {
        exchange: (serviceName: string): Promise<AxiosResponse<TokenInfo>> => {
          return apiClient.post(AuthEndpoints.users.exchangeServiceToken(), {service: serviceName});
        }
      }
    },
  }
}
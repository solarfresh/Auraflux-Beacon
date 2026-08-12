import { AuthEndpoints } from '@auraflux/shared-core/api/endpoints';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
// import type { ID } from '@auraflux/design-system/interfaces/core';
import type { TokenInfo, User } from '@auraflux/shared-core/interfaces/user';
import { AxiosResponse } from 'axios';

export const apiService = {
  auth: {
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
import type { ID } from '@auraflux/design-system/interfaces/core';
import config from '@auraflux/shared-core/config';

const AURAFLUX_AUTH_URL = config.AURAFLUX_AUTH_URL;

const AgentsEndpoints = {
  models: {
    base: () =>
      `${AURAFLUX_AUTH_URL}/agents/models/`,
    available: () =>
      `${AURAFLUX_AUTH_URL}/agents/models/available/`,
    details: (providerId: ID) =>
      `${AURAFLUX_AUTH_URL}/agents/models/${providerId}/`,
  }
}

const UsersEndpoints = {
  check: () =>
    `${AURAFLUX_AUTH_URL}/users/status/`,
  login: () =>
    `${AURAFLUX_AUTH_URL}/users/login/`,
  refreshToken: () =>
    `${AURAFLUX_AUTH_URL}/iam/tokens/refresh/`,
  exchangeServiceToken: () =>
    `${AURAFLUX_AUTH_URL}/iam/tokens/exchange/`,
};

export const AuthEndpoints = {
  agents: AgentsEndpoints,
  users: UsersEndpoints
};

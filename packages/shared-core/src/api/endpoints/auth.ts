import config from '@auraflux/shared-core/config';

const AURAFLUX_AUTH_URL = config.AURAFLUX_AUTH_URL;

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
  users: UsersEndpoints
};

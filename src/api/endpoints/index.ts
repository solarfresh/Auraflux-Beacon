import config from '@/config';

const AURAFLUX_NEXUS_URL = config.AURAFLUX_NEXUS_URL;

export const SearchEndpoints = {
  results: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/search/results/`,
  },
  assistant: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/search/assistant/`,
  },
};

export const UsersEndpoints = {
  login: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/users/login/`,
  },
  refreshToken: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/users/token/refresh/`,
  },
}

export const WorkflowsEndpoints = {
  dichotomies: {
    get: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/dichotomies/`,
  },
  fetchState: {
    get: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/fetch-state/`,
  },
  lockData: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/lock-data/`,
  },
}

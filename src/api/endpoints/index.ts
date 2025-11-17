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
  }
}

export const WorkflowsEndpoints = {
  fetchState: {
    get: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/fetch-state/`,
  }
}

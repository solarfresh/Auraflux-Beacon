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

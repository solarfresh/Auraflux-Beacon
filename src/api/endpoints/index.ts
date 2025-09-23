import config from '@/config';

const AURAFLUX_NEXUS_URL = config.AURAFLUX_NEXUS_URL;

export const SearchEndpoints = {
  create: () =>
    `${AURAFLUX_NEXUS_URL}/search/results/`,
};
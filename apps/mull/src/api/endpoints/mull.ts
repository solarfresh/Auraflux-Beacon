import config from '@auraflux/shared-core/config';

const AURAFLUX_MULL_URL = config.AURAFLUX_MULL_URL;

const ProjectsEndpoints = {
  base: () =>
    `${AURAFLUX_MULL_URL}/projects/`,
};

export const MullEndpoints = {
  projects: ProjectsEndpoints
};
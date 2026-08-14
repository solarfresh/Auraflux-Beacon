import { ID } from '@auraflux/design-system/interfaces/core';
import config from '@auraflux/shared-core/config';

const AURAFLUX_MULL_URL = config.AURAFLUX_MULL_URL;

const ProjectsEndpoints = {
  base: () =>
    `${AURAFLUX_MULL_URL}/projects/`,
  files: (projectId: ID) =>
    `${AURAFLUX_MULL_URL}/projects/${projectId}/files/upload/`,
};

export const MullEndpoints = {
  projects: ProjectsEndpoints
};
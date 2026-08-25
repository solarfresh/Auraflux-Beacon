import { ID } from '@auraflux/design-system/interfaces/core';
import config from '@auraflux/shared-core/config';

const AURAFLUX_MULL_URL = config.AURAFLUX_MULL_URL;

const ProjectsEndpoints = {
  base: () =>
    `${AURAFLUX_MULL_URL}/projects/`,
  agents: {
    base: (projectId: ID) =>
      `${AURAFLUX_MULL_URL}/projects/${projectId}/agents/`,
    details: {
      base: (projectId: ID, agentId: ID) =>
        `${AURAFLUX_MULL_URL}/projects/${projectId}/agents/${agentId}/`,
    }
  },
  files: {
    base: (projectId: ID) =>
      `${AURAFLUX_MULL_URL}/projects/${projectId}/files/`,
    details: {
      base: (projectId: ID, fileId: ID) =>
        `${AURAFLUX_MULL_URL}/projects/${projectId}/files/${fileId}/`,
    }
  }

};

export const MullEndpoints = {
  projects: ProjectsEndpoints
};
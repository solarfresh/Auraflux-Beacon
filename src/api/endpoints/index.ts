import config from '@/config';
import { ID } from '@/interfaces/core';

const AURAFLUX_NEXUS_URL = config.AURAFLUX_NEXUS_URL;

export const CanvasesEndpoints = {
  graphs: {
    get: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/`,
  },
  nodes: {
    delete: (canvasId: ID, nodeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/nodes/${nodeId}/`,
    update: (canvasId: ID, nodeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/nodes/${nodeId}/`,
  }
}

export const KnowledgeEndpoints = {
  keywords: {
    update: (keywordId: ID) =>
      `${AURAFLUX_NEXUS_URL}/knowledge/keywords/${keywordId}/`,
  },
  scopes: {
    update: (scopeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/knowledge/scopes/${scopeId}/`,
  }
}

export const UsersEndpoints = {
  check: {
    get: () =>
      `${AURAFLUX_NEXUS_URL}/users/status/`,
  },
  login: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/users/login/`,
  },
  refreshToken: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/users/token/refresh/`,
  },
}

export const ProjectsEndpoints = {
  base: {
    createReflectionLog: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/reflection/`,
    getReflectionLog: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/reflection/`,
    updateReflectionLogById: (logId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/reflection/${logId}/`,
  },
  initiation: {
    chat: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/initiation/chat/`,
    getChatHistory: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/initiation/chat/history/`,
    getRefinedTopic: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/initiation/topic/`,
  },
  exploration: {
    createSession: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/exploration/session/`,
    getSidebarRegistryInfo: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/exploration/sidebar/`,
    recommendConceptualNodes: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/exploration/${canvasId}/nodes/`,
  },
  keywords: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/keywords/`,
  },
  scopes: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/projects/b0cdd497-05aa-4355-a7d8-370eef58d4b9/scopes/`,
  }
}

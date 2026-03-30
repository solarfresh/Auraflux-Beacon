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
    getProject: () =>
      `${AURAFLUX_NEXUS_URL}/projects/`,
    getProjectDetail: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/`,
    updateProjectDetail: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/`,
    createReflectionLog: (projectId:ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/reflection/`,
    getReflectionLog: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/reflection/`,
    updateReflectionLogById: (logId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/reflection/${logId}/`,
  },
  initiation: {
    chat: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/initiation/chat/`,
    getChatHistory: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/initiation/chat/history/`,
    getRefinedTopic: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/initiation/topic/`,
  },
  exploration: {
    createSession: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/session/`,
    getSidebarRegistryInfo: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/sidebar/`,
    recommendConceptualNodes: (projectId: ID, canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/${canvasId}/nodes/`,
  },
  keywords: {
    create: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/keywords/`,
  },
  scopes: {
    create: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/scopes/`,
  }
}

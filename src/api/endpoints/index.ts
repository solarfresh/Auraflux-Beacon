import config from '@/config';
import { ID } from '@/interfaces/core';

const AURAFLUX_NEXUS_URL = config.AURAFLUX_NEXUS_URL;

export const AgentsEndpoints = {
  createConfig: () =>
    `${AURAFLUX_NEXUS_URL}/agents/`,
  createModelProvider: () =>
    `${AURAFLUX_NEXUS_URL}/agents/models/`,
  getAgents: () =>
    `${AURAFLUX_NEXUS_URL}/agents/`,
  getAgentDetail: (agentId: ID) =>
    `${AURAFLUX_NEXUS_URL}/agents/${agentId}/`,
  getAvailableModels: () =>
    `${AURAFLUX_NEXUS_URL}/agents/models/available/`,
  getModelProviders: () =>
    `${AURAFLUX_NEXUS_URL}/agents/models/`,
  updateAgentDetail: (agentId: ID) =>
    `${AURAFLUX_NEXUS_URL}/agents/${agentId}/`,
  updateModelProvider: (providerId: ID) =>
    `${AURAFLUX_NEXUS_URL}/agents/models/${providerId}/`,
}

export const CanvasesEndpoints = {
  graphs: {
    get: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/`,
  },
  edges: {
    create: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/edges/`,
    recommendConceptualEdges: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/edges/recommend/`,
    delete: (canvasId: ID, edgeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/edges/${edgeId}/`,
    update: (canvasId: ID, edgeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/edges/${edgeId}/`,
  },
  nodes: {
    create: (canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/nodes/`,
    delete: (canvasId: ID, nodeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/nodes/${nodeId}/`,
    update: (canvasId: ID, nodeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/canvases/${canvasId}/nodes/${nodeId}/`,
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
    createProject: () =>
      `${AURAFLUX_NEXUS_URL}/projects/`,
    getProjectDetail: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/`,
    updateProjectDetail: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/`,
    createConceptualNodes: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/nodes/`,
    getConceptualNodes: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/nodes/`,
    updateConceptualNodes: (projectId: ID, nodeId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/nodes/${nodeId}/`,
  },
  consultation: {
    chat: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/consultation/chat/`,
    getChatHistory: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/consultation/chat/history/`,
  },
  exploration: {
    createSession: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/session/`,
    getSessionInfo: (projectId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/session/`,
    recommendConceptualNodes: (projectId: ID, canvasId: ID) =>
      `${AURAFLUX_NEXUS_URL}/projects/${projectId}/exploration/${canvasId}/nodes/recommend/`,
  },
}

import config from '@/config';

const AURAFLUX_NEXUS_URL = config.AURAFLUX_NEXUS_URL;

export const KnowledgeEndpoints = {
  keywords: {
    update: (keywordId: string) =>
      `${AURAFLUX_NEXUS_URL}/knowledge/keywords/${keywordId}/`,
  },
  scopes: {
    update: (scopeId: string) =>
      `${AURAFLUX_NEXUS_URL}/knowledge/scopes/${scopeId}/`,
  }
}

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

export const WorkflowsEndpoints = {
  base: {
    chat: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/chat/`,
    getChatHistory: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/chat/history/`,
    createReflectionLog: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/reflection/`,
    getReflectionLog: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/reflection/`,
    updateReflectionLogById: (logId: string) =>
      `${AURAFLUX_NEXUS_URL}/workflows/reflection/${logId}/`,
  },
  initiation: {
    getRefinedTopic: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/initiation/topic/`,
  },
  exploration: {
    getSidebarRegistryInfo: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/exploration/sidebar/`,
  },
  keywords: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/keywords/`,
  },
  scopes: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/scopes/`,
  }
}

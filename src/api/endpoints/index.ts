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
  initiation: {
    chat: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/chat`,
    getChatHistory: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/chat_history`,
    getRefinedTopic: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/refined_topic`,
  },
  keywords: {
    create: () =>
      `${AURAFLUX_NEXUS_URL}/workflows/b0cdd497-05aa-4355-a7d8-370eef58d4b9/topic_keywords`,
    update: (keywordId: string) =>
      `${AURAFLUX_NEXUS_URL}/keywords/${keywordId}/`,
  }
}

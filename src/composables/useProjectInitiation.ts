import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import { useProjectStore } from '@/stores/project';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import { ID } from '@/interfaces/core';

export function useProjectInitiation() {
  const projectStore = useProjectStore();
  const initiativeStore = useInitiativeStore();
  const route = useRoute();

  const currentProjectId = computed((): ID => {
    return projectStore.currentProjectId || route.params.id as ID;
  });

  async function addMessage(messageContent: string) {
    if (currentProjectId.value === null) return;

    const agentName = 'ExplorerAgent';
    initiativeStore.addMessage(messageContent, agentName);
    apiService.projects.initiation.chat(currentProjectId.value, messageContent, agentName);
  };

  async function getMessages() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.initiation.getChatHistory(currentProjectId.value);
    if (response.data) {
      initiativeStore.setMessages(response.data);
    }
  }

  async function getRefinedTopic() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.initiation.getRefinedTopic(currentProjectId.value);
    if (response.data) {
      initiativeStore.setRefinedTopic(response.data);
    }
  }

  async function getReflection() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.base.getReflectionLog(currentProjectId.value);
    if (response.data) {
      initiativeStore.setReflection(response.data);
    }
  }

  return {
    addMessage,
    getMessages,
    getRefinedTopic,
    getReflection
  };
};
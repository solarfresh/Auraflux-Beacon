import { apiService } from '@/api/apiService';
import { useConsultationStore } from '@/stores/consultation';
import { useProjectStore } from '@/stores/project';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import { ID } from '@/interfaces/core';

export function useProjectConsultation() {
  const projectStore = useProjectStore();
  const consultationStore = useConsultationStore();
  const route = useRoute();

  const currentProjectId = computed((): ID => {
    return route.params.id as ID || projectStore.currentProjectId || '';
  });

  async function loadConsultationData() {
    if (projectStore.currentProjectId === null) {
      projectStore.setCurrentProjectId(route.params.id as ID);
    }

    try {
      getMessages();
      getRefinedTopic();
      getReflection();
      if (projectStore.currentStage !== 'CONSULTATION') {
        await projectStore.updateProjectDetail(projectStore.currentProjectId as ID, {currentStage: 'CONSULTATION'})
      } else {
        await projectStore.loadProjectDetail(projectStore.currentProjectId as ID);
      }
    } catch (error) {
      console.error('Failed to load exploration data:', error);
    }
  }

  async function addMessage(messageContent: string) {
    if (currentProjectId.value === null) return;

    const agentName = 'ExplorerAgent';
    consultationStore.addMessage(messageContent, agentName);
    apiService.projects.consultation.chat(currentProjectId.value, messageContent, agentName);
  };

  async function getMessages() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.consultation.getChatHistory(currentProjectId.value);
    if (response.data) {
      consultationStore.setMessages(response.data);
    }
  }

  async function getRefinedTopic() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.consultation.getRefinedTopic(currentProjectId.value);
    if (response.data) {
      consultationStore.setRefinedTopic(response.data);
    }
  }

  async function getReflection() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.base.getReflectionLog(currentProjectId.value);
    if (response.data) {
      consultationStore.setReflection(response.data);
    }
  }

  return {
    addMessage,
    loadConsultationData,
  };
};
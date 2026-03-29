import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import { useProjectStore } from '@/stores/project';

export function useProjectInitiation() {
  const projectStore = useProjectStore();
  const initiativeStore = useInitiativeStore();

  async function addMessage(messageContent: string) {
    if (projectStore.currentProjectId === null) return;

    const agentName = 'ExplorerAgent';
    initiativeStore.addMessage(messageContent, agentName);
    apiService.projects.initiation.chat(projectStore.currentProjectId, messageContent, agentName);
  };

  async function getMessages() {
    if (projectStore.currentProjectId === null) return;

    let response = await apiService.projects.initiation.getChatHistory(projectStore.currentProjectId);
    if (response.data) {
      initiativeStore.setMessages(response.data);
    }
  }

  async function getRefinedTopic() {
    if (projectStore.currentProjectId === null) return;

    let response = await apiService.projects.initiation.getRefinedTopic(projectStore.currentProjectId);
    if (response.data) {
      initiativeStore.setRefinedTopic(response.data);
    }
  }

  async function getReflection() {
    if (projectStore.currentProjectId === null) return;

    let response = await apiService.projects.base.getReflectionLog(projectStore.currentProjectId);
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
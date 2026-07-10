import { apiService } from '@/api/apiService';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import type { ID } from '@/interfaces/core';
import type { Project } from '@/interfaces/project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ChatMessage } from '@/interfaces/core';
import { v4 as uuidv4 } from 'uuid';

// --- Store Definition ---

export const useProjectStore = defineStore('project', () => {

  // --- State (Refs) ---
  const chatMessages = ref<ChatMessage[]>([]);
  const isTyping = ref(false);

  const conceptualNodes = ref<Map<string, ConceptualNode>>(new Map());

  const projects = ref<Map<string, Project>>(new Map());
  const currentProjectId = ref<ID | null>(null);
  const activeCanvasId = ref<ID>('');

  // --- Getters (Computed) ---
  /** The current stage of the Information Search Process (ISP). */
  const currentStage = computed(() => {
    if (currentProjectId.value === null) return;

    return projects.value.get(currentProjectId.value)?.currentStage;
  });

  const projectName = computed(() => {
    if (currentProjectId.value === null) return;

    return projects.value.get(currentProjectId.value)?.name;
  });

  // --- Actions (Functions) ---
  const createConceptualNodes = async (node: ConceptualNode) => {
    if (!currentProjectId.value) return;

    try {
      await apiService.projects.base.createConceptualNodes(
        currentProjectId.value, node
      );
      conceptualNodes.value.set(node.id, node);
    } catch (error) {
      console.error(`[API Error] Failed to persist node:`, error);
      throw error;
    }
  };

  async function createProject(project: Project) {
    try {
      let response = await apiService.projects.base.createProject(project);
      if (response.data) {
        projects.value.set(response.data.id, response.data);
      } else {
      console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to create a project:', error);
    }
  };

  async function loadProjects() {
    try {
      let response = await apiService.projects.base.getProject();
      if (response.data) {
        response.data.map(project => {
          projects.value.set(project.id, project);
        });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  async function loadConceptualNodes() {
    if (conceptualNodes.value.size) return;

    try {
      let response = await apiService.projects.base.getConceptualNodes(currentProjectId.value as ID);
      if (response.data) {
        response.data.map((node: ConceptualNode) => {
          conceptualNodes.value.set(node.id, node);
        });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load exploration data:', error);
    }
  };

  async function loadExplorationPhaseData() {
    try {
      let response = await apiService.projects.exploration.getSessionInfo(currentProjectId.value as ID);
      if (response.data) {
        activeCanvasId.value = response.data.activeCanvasId;
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to load a project: ${currentProjectId.value}`, error);
    }
  }

  async function loadProjectDetail() {
    if (currentProjectId.value && projects.value.get(currentProjectId.value)) return;

    try {
      let response = await apiService.projects.base.getProjectDetail(currentProjectId.value as ID);
      if (response.data) {
        projects.value.set(response.data.id, response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to load a project: ${currentProjectId.value}`, error);
    }
  }

  async function setCurrentProjectId(projectId: ID) {
    currentProjectId.value = projectId;
  };

  const updateConceptualNode = async (node: ConceptualNode) => {
    if (!currentProjectId.value) return;

    try {
      await apiService.projects.base.updateConceptualNodes(
        currentProjectId.value, node.id, node
      );
      conceptualNodes.value.set(node.id, node);
    } catch (error) {
      console.error(`[API Error] Failed to persist node:`, error);
      throw error;
    }
  };

  async function updateProjectDetail(data: Partial<Project>) {
    try {
      let response = await apiService.projects.base.updateProjectDetail(currentProjectId.value as ID, data);
      if (response.data) {
        projects.value.set(response.data.id, response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to update a project: ${currentProjectId.value}`, error);
    }
  }

  async function addMessage(messageContent: string, agentName: string) {
    if (currentProjectId.value === null) return;

    isTyping.value = true;
    chatMessages.value.push({
      id: uuidv4(),
      role: 'user',
      content: messageContent,
      name: 'User',
      timestamp: new Date().toISOString(),
      sequenceNumber: chatMessages.value.length + 1,
    } as ChatMessage); // Type assertion for strict compliance
    chatMessages.value.push({
      id: uuidv4(),
      role: 'system',
      content: 'Agent is typing...',
      name: agentName,
      timestamp: new Date().toISOString(),
      sequenceNumber: chatMessages.value.length + 2,
    } as ChatMessage);

    apiService.projects.consultation.chat(currentProjectId.value, messageContent, agentName);
  }

  async function getMessages() {
    if (currentProjectId.value === null) return;

    let response = await apiService.projects.consultation.getChatHistory(currentProjectId.value);
    if (response.data) {
      chatMessages.value = response.data;
    }
  }

  // --- Return public API ---
  return {
    activeCanvasId,
    chatMessages,
    projects,
    currentProjectId,
    conceptualNodes,
    // Getters
    currentStage,
    projectName,
    isTyping,
    // Actions
    createConceptualNodes,
    createProject,
    loadConceptualNodes,
    loadExplorationPhaseData,
    loadProjects,
    loadProjectDetail,
    setCurrentProjectId,
    updateConceptualNode,
    updateProjectDetail,
    addMessage,
    getMessages
  };
});
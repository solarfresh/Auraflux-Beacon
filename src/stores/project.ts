import { apiService } from '@/api/apiService';
import type { ID } from '@/interfaces/core';
import type {
  ISPStage,
  Project,
} from '@/interfaces/project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// --- Store Definition ---

export const useProjectStore = defineStore('project', () => {

  // --- State (Refs) ---
  const projects = ref<Map<string, Project>>(new Map());
  const currentProjectId = ref<ID | null>(null);

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

  async function loadProjectDetail(projectId: ID) {
    try {
      let response = await apiService.projects.base.getProjectDetail(projectId);
      if (response.data) {
        projects.value.set(response.data.id, response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to load a project: ${projectId}`, error);
    }
  }

  async function setCurrentProjectId(projectId: ID) {
    currentProjectId.value = projectId;
  };

  async function updateProjectDetail(projectId: ID, data: Partial<Project>) {
    try {
      let response = await apiService.projects.base.updateProjectDetail(projectId, data);
      if (response.data) {
        projects.value.set(response.data.id, response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to update a project: ${projectId}`, error);
    }
  }

  // --- Return public API ---
  return {
    projects,
    currentProjectId,
    // Getters
    currentStage,
    projectName,
    // Actions
    loadProjects,
    loadProjectDetail,
    setCurrentProjectId,
    updateProjectDetail
  };
});
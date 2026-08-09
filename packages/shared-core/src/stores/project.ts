import { apiService } from '@auraflux/shared-core/api/apiService';
import type { ID } from '@auraflux/shared-core/interfaces/core';
import type { Project } from '@auraflux/shared-core/interfaces/project';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// --- Store Definition ---

export const useProjectStore = defineStore('project', () => {

  // --- State (Refs) ---
  const projects = ref<Map<string, Project>>(new Map());
  const currentProjectId = ref<ID | null>(null);

  // --- Getters (Computed) ---
  /** The current stage of the Information Search Process (ISP). */
  const currentTool = computed(() => {
    if (currentProjectId.value === null) return;

    return projects.value.get(currentProjectId.value)?.currentTool;
  });

  const projectName = computed(() => {
    if (currentProjectId.value === null) return;

    return projects.value.get(currentProjectId.value)?.name;
  });

  // --- Actions (Functions) ---
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

  // --- Return public API ---
  return {
    projects,
    currentProjectId,
    currentTool,
    // Getters
    projectName,
    // Actions
    createProject,
    loadProjects,
    loadProjectDetail,
    setCurrentProjectId,
    updateProjectDetail,
  };
});
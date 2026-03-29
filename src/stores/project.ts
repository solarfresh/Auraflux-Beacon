import { apiService } from '@/api/apiService';
import type { ID } from '@/interfaces/core';
import type {
  ISPStage,
  Project,
} from '@/interfaces/project';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// --- Store Definition ---

export const useProjectStore = defineStore('project', () => {

  // --- State (Refs) ---
  const projects = ref<Map<string, Project>>(new Map());

  const currentProjectId = ref<ID | null>(null);

  /** The current stage of the Information Search Process (ISP). */
  const currentStage = ref<ISPStage>('INITIATION');

  // --- Getters (Computed) ---

  /** Checks if the current step allows the Export Report feature. */
  // const isExportAvailable = computed(() => {
  //     return currentStage.value === 'COLLECTION' || currentStage.value === 'PRESENTATION';
  // });


  // --- Actions (Functions) ---
  async function loadProjects() {
    try {
      let response = await apiService.projects.base.getProject();
      if (response.data) {
        Object.entries(response.data).map(([key, value]) => {
          projects.value.set(key, value);
        });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  // --- Return public API ---
  return {
    currentProjectId,
    currentStage,
    // Getters
    // isQuestionFinalized,
    // isExportAvailable,

    // Actions
    loadProjects,
  };
});
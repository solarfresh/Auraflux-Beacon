import { apiService } from '@/api/apiService';
import { ID } from '@/interfaces/core';
import { useExplorationStore } from '@/stores/exploration';
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useProjectExploration() {
  const explorationStore = useExplorationStore();
  const projectStore = useProjectStore();
  const route = useRoute();

  const currentProjectId = computed((): ID => {
    return route.params.id as ID || projectStore.currentProjectId || '';
  });

  async function loadExplorationData() {
    if (projectStore.currentProjectId === null) {
      projectStore.setCurrentProjectId(route.params.id as ID);
    }

    try {
      await loadSidebarRegistryInfo();
      if (projectStore.currentStage !== 'EXPLORATION') {
        await projectStore.updateProjectDetail(projectStore.currentProjectId as ID, {currentStage: 'EXPLORATION'})
      } else {
        await projectStore.loadProjectDetail(projectStore.currentProjectId as ID);
      }
    } catch (error) {
      console.error('Failed to load exploration data:', error);
    }
  }

  async function loadSidebarRegistryInfo() {
    try {
      let response = await apiService.projects.exploration.getSidebarRegistryInfo(currentProjectId.value);
      if (response.data) {
        explorationStore.setSidebarRegistryInfo(response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load exploration data:', error);
    }
  };

  return {
    currentProjectId,
    loadExplorationData,
  };
};

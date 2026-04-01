import { apiService } from '@/api/apiService';
import { POSITION_SCALE } from '@/constants/canvases';
import { ConceptualNode } from '@/interfaces/conceptual-map';
import { ID } from '@/interfaces/core';
import { useExplorationStore } from '@/stores/exploration';
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useProjectExploration() {
  const projectStore = useProjectStore();
  const explorationStore = useExplorationStore();
  const route = useRoute();

  const currentProjectId = computed((): ID => {
    return route.params.id as ID || projectStore.currentProjectId || '';
  });

  const activeCanvasId = computed(() => explorationStore.activeCanvasId);
  const conceptualNodes = computed(() => explorationStore.conceptualNodes);
  const sidebarNodes = computed(() => explorationStore.sidebarNodes);

  async function loadExplorationData() {
    if (projectStore.currentProjectId === null) {
      projectStore.setCurrentProjectId(route.params.id as ID);
    }

    try {
      await loadSidebarRegistryInfo();
      await loadCanvasView();
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

  async function loadCanvasView() {
    try {
      let response = await apiService.canvases.graphs.get(activeCanvasId.value);
      if (response.data) {
        explorationStore.setConceptualGraph(response.data)
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load exploration data:', error);
    }
  };

  async function recommendConceptualNodes() {
    let aiSuggestedNodes = [...conceptualNodes.value.values()].filter(node => node.status === 'AI_EXTRACTED');
    if (aiSuggestedNodes.length < 1 && conceptualNodes.value.size < sidebarNodes.value.size) {
      apiService.projects.exploration.recommendConceptualNodes(currentProjectId.value, activeCanvasId.value);
    }
  };

  async function updateConeptualNode(node: ConceptualNode) {
    try {
      let nodeData = JSON.parse(JSON.stringify(node));
      if (nodeData.position) {
        nodeData.position.x /= POSITION_SCALE;
        nodeData.position.y /= POSITION_SCALE;
      }

      let response = await apiService.canvases.nodes.update(activeCanvasId.value, nodeData.id, nodeData);
      if (response.data) {
        let newNode = response.data;
        if (newNode.position) {
          newNode.position.x *= POSITION_SCALE;
          newNode.position.y *= POSITION_SCALE;
        }

        explorationStore.conceptualNodes.set(newNode.id, newNode);
        recommendConceptualNodes();
      }
    } catch (error) {
      console.error('Failed to update node:', error);
    }
  };

  return {
    loadExplorationData,
    updateConeptualNode,
  };
};

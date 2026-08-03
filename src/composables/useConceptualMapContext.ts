/**
 * @file useConceptualMapContext.ts
 * @description Scoped State Holder for the Conceptual Map Canvas.
 * Encapsulates high-frequency UI states (dragging, viewport) and temporary form caches
 * to prevent global Pinia reactive hijacking and ensure synchronized garbage collection.
 */

import { ref, reactive, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { ID } from '@/interfaces/core';
import type { Connection } from '@vue-flow/core';
import type { ConceptualNode, ConceptualEdge, ConceptualGraph } from '@/interfaces/conceptual-map';
import { useCanvasStore } from '@/stores/canvas';
import { useNotificationStore } from '@/stores/notification';
import { POSITION_SCALE } from '@/constants/canvases';
import { apiService } from '@/api/apiService';

interface ContextConfig {
  getCanvasId?: () => ID;
  getProjectId?: () => ID;
  getRegistryCount?: () => number;
}

export function useConceptualMapContext(config?: ContextConfig) {
  const canvasStore = useCanvasStore();
  const notifyStore = useNotificationStore();

  // --------------------------------------------------------------------------
  // 1. Core Graph Data States (Scoped)
  // --------------------------------------------------------------------------
  const conceptualNodes = reactive(new Map<string, ConceptualNode>());
  const conceptualEdges = ref<ConceptualEdge[]>([]);

  // --------------------------------------------------------------------------
  // 2. High-Frequency Drag & Drop UI States
  // --------------------------------------------------------------------------
  const isDragging = ref(false);
  const isDragOver = ref(false);
  const draggedNode = ref<ConceptualNode | null>(null);
  const viewport = reactive({ x: 0, y: 0, zoom: 1 });

  // --------------------------------------------------------------------------
  // 3. Low-Frequency Connection Interceptor Form States
  // --------------------------------------------------------------------------
  const isInterceptionActive = ref(false);
  const interceptorAction = ref<'create' | 'update'>('create');
  const interceptorPosition = reactive({ x: 0, y: 0 });
  const pendingConnection = ref<Connection | null>(null);

  const localEdgeData = ref<ConceptualEdge>({
    id: uuidv4(),
    label: '',
    type: 'REF',
    evidence: '',
    weight: 1.0,
    source: '',
    sourceHandle: '',
    target: '',
    targetHandle: '',
  });

  // --------------------------------------------------------------------------
  // Low-Frequency Node Editor Form States
  // --------------------------------------------------------------------------
  const isNodeEditActive = ref(false);
  const editingNodeId = ref<string>('');
  const localNodeData = ref({
    label: '',
    status: ''
  });

  watch(
    () => notifyStore.latestCanvasUpdate,
    async (newUpdate) => {
      if (!newUpdate) return;

      const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
      if (!canvasId || newUpdate.canvasId !== canvasId) return;

      switch (newUpdate.type) {
        case 'GRAPH_SYNC':
          await initializeSandbox(newUpdate.data);
          syncBackToGlobalCache();
          break;
        case 'EDGE_ADD':
          const graph: ConceptualGraph = newUpdate.data;
          const edges = graph.edges;
          edges.map((edge) => {
            conceptualEdges.value.push(edge);
          });
          syncBackToGlobalCache();
          break;
      }
    },
    { deep: true }
  );

  const openNodeEditor = (nodeId: string, node: ConceptualNode) => {
    isNodeEditActive.value = true;
    editingNodeId.value = nodeId;
    localNodeData.value = {
      label: node.label || '',
      status: node.status || 'LOCKED'
    };
  };

  const closeNodeEditor = () => {
    isNodeEditActive.value = false;
    editingNodeId.value = '';
    localNodeData.value = { label: '', status: '' };
  };

  // --------------------------------------------------------------------------
  // B. Cache Orchestration Pipeline
  // --------------------------------------------------------------------------

  /**
   * Primary Entry Point: Load data from Cache or fallback to remote API
   */
  const fetchGraphData = async () => {
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    if (!canvasId) {
      console.log('[Context API Warning] Missing canvas ID in configuration. Edge update aborted.');
      return;
    }

    // Step 1: Check global Pinia archive
    let graphData = canvasStore.getGraphCache(canvasId);

    if (!graphData) {
      // Step 2: Cache Miss -> Trigger network request via store
      graphData = await canvasStore.fetchAndCacheGraph(canvasId);
    }

    // Step 3: Populate local sandbox using the cold dataset
    initializeSandbox(graphData);
  };

  /**
   * Clones and scales cold storage snapshots into localized reactive variables
   */
  const initializeSandbox = async (graph: ConceptualGraph) => {
    conceptualNodes.clear();

    // Deep copy objects to insulate runtime mutations from contaminating cold storage coordinates
    Object.entries(graph.nodes).forEach(([key, value]) => {
      const sourcePosition = value.position || { x: 0, y: 0 };
      const clonedNode = {
        ...value,
        position: {
          x: sourcePosition.x * POSITION_SCALE,
          y: sourcePosition.y * POSITION_SCALE,
        }
      };
      conceptualNodes.set(key, clonedNode);
    });

    conceptualEdges.value = [...graph.edges];
  };

  /**
   * Internal Helper: Commits local scoped mutations back into the cold store backup map
   */
  const syncBackToGlobalCache = () => {
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    if (!canvasId) {
      console.log('[Context API Warning] Missing canvas ID in configuration. Edge update aborted.');
      return;
    }

    const rawNodesRecord: Map<string, ConceptualNode> = new Map();

    // Scale down back to storage baseline coordinates before backup
    conceptualNodes.forEach((node, key) => {
      const nodePosition = node.position || { x: 0, y: 0 };
      rawNodesRecord.set(key, {
        ...node,
        position: {
          x: nodePosition.x / POSITION_SCALE,
          y: nodePosition.y / POSITION_SCALE
        }
      });
    });

    canvasStore.updateCacheSnapshot(canvasId, {
      canvasId: canvasId,
      nodes: rawNodesRecord,
      edges: [...conceptualEdges.value]
    });
  };

  // --------------------------------------------------------------------------
  // C. Local Mutations & Persistence Engine
  // --------------------------------------------------------------------------

  /**
   * Dispatches node updates including moving, editing, or structural deletes.
   */
  const updateConceptualMapNode = async (node: ConceptualNode, action: 'move' | 'edit' | 'delete') => {
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    if (!canvasId) {
      console.log('[Context API Warning] Missing canvas ID in configuration. Edge update aborted.');
      return;
    }

    if (action === 'edit' || action === 'move') {
      let modifiedNodeData = {
        ...node,
        position: {
          x: node.position!.x / POSITION_SCALE,
          y: node.position!.y / POSITION_SCALE
        }
      };

      try {
        const response = await apiService.canvases.nodes.update(canvasId, node.id, modifiedNodeData);

        if (action === 'edit') {
          recommendConceptualNodes();
        }

        if (response.data) {
          conceptualNodes.set(node.id, node);
        }
      } catch (error) {
        console.error(`[Context API Error] Failed to persist node via ${action}:`, error);
        throw error;
      }
    } else if (action === 'delete') {
      await apiService.canvases.nodes.delete(canvasId, node.id);
      conceptualNodes.delete(node.id);
      // Cascade delete associated edges to prevent dangling connections
      conceptualEdges.value = conceptualEdges.value.filter(e => e.source !== node.id && e.target !== node.id);
    } else if (action === 'group') {
      // TODO: Implement group node logic
    } else {
      conceptualNodes.set(node.id, node);
    }

    // Synchronize local change to global store layer for fast tabs toggling
    syncBackToGlobalCache();
  };

  /**
   * Coordinates Edge persistence with backend API and updates local scoped state.
   * Cleans up redundant 'push' actions from previous store bugs.
   */
  const updateConceptualMapEdge = async (edge: ConceptualEdge, action: 'create' | 'delete' | 'update') => {
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    if (!canvasId) {
      console.log('[Context API Warning] Missing canvas ID in configuration. Edge update aborted.');
      return;
    }

    try {
      if (action === 'update') {
        const existingIndex = conceptualEdges.value.findIndex(e => e.id === edge.id);
        if (existingIndex !== -1) {
          const response = await apiService.canvases.edges.update(canvasId, edge.id, edge);
          conceptualEdges.value[existingIndex] = response.data || edge;
        }
      } else if (action === 'create') {
        const response = await apiService.canvases.edges.create(canvasId, edge);
        conceptualEdges.value.push(response.data || edge);
      } else if (action === 'delete') {
        await apiService.canvases.edges.delete(canvasId, edge.id);
        conceptualEdges.value = conceptualEdges.value.filter(e => e.id !== edge.id);
      }

      // Synchronize local change to global store layer for fast tabs toggling
      syncBackToGlobalCache();
    } catch (error) {
      console.error(`[Context API Error] Failed to ${action} edge:`, error);
      throw error; // Propagate to let UI handle error states if necessary
    }
  };

  const recommendConceptualEdges = async (nodes: ConceptualNode[]) => {
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    if (!canvasId) {
      console.log('[Context API Warning] Missing canvas ID in configuration. Edge recommendation aborted.');
      return;
    }

    try {
      apiService.canvases.edges.recommendConceptualEdges(canvasId, nodes);
    }  catch (error) {
      console.error('[AI Recommendation Error]', error);
    }
  }

  const recommendConceptualNodes = async () => {
    const aiSuggestedNodes = Array.from(conceptualNodes.values())
      .filter(node => node.status === 'AI_EXTRACTED');

    const currentSandboxSize = conceptualNodes.size;
    const projectId = config?.getProjectId ? config.getProjectId() : null;
    const canvasId = config?.getCanvasId ? config.getCanvasId() : null;
    const maxRegistryCount = config?.getRegistryCount ? config.getRegistryCount() : Infinity;

    if (projectId && canvasId && aiSuggestedNodes.length < 1 && currentSandboxSize < maxRegistryCount) {
      try {
        apiService.projects.exploration.recommendConceptualNodes(projectId, canvasId);
      } catch (error) {
        console.error('[AI Recommendation Error]', error);
      }
    }
  };

  // --------------------------------------------------------------------------
  // 5. UI Interactivity Actions
  // --------------------------------------------------------------------------
  const setDragStatus = (status: { isDragging?: boolean; isDragOver?: boolean }) => {
    if (status.isDragging !== undefined) isDragging.value = status.isDragging;
    if (status.isDragOver !== undefined) isDragOver.value = status.isDragOver;
  };

  const openInterceptor = (connection: Connection | null, position: { x: number; y: number }, existingEdge?: ConceptualEdge) => {
    isInterceptionActive.value = true;
    pendingConnection.value = connection;
    interceptorPosition.x = position.x;
    interceptorPosition.y = position.y;

    if (existingEdge) {
      interceptorAction.value = 'update';
      localEdgeData.value = { ...existingEdge };
    } else if (connection) {
      interceptorAction.value = 'create';
      localEdgeData.value = {
        id: uuidv4(),
        label: '',
        type: 'REF',
        evidence: '',
        weight: 1.0,
        source: connection.source,
        sourceHandle: connection.sourceHandle?.replace('source-', '').replace('target-', '') || '',
        target: connection.target,
        targetHandle: connection.targetHandle?.replace('source-', '').replace('target-', '') || '',
      };
    } else {
      closeInterceptor();
    }
  };

  const closeInterceptor = () => {
    isInterceptionActive.value = false;
    pendingConnection.value = null;
  };

  const updateLocalEdgeData = (patch: Partial<ConceptualEdge>) => {
    localEdgeData.value = { ...localEdgeData.value, ...patch };
  };

  // --------------------------------------------------------------------------
  // 6. Return Payload
  // --------------------------------------------------------------------------
  return {
    // Reactive States (Leaf components grab references directly)
    config,
    conceptualNodes,
    conceptualEdges,
    isDragging,
    isDragOver,
    draggedNode,
    viewport,
    isInterceptionActive,
    interceptorAction,
    interceptorPosition,
    pendingConnection,
    localEdgeData,
    isNodeEditActive,
    editingNodeId,
    localNodeData,

    // Actions
    fetchGraphData,
    updateConceptualMapNode,
    updateConceptualMapEdge,
    setDragStatus,
    openInterceptor,
    closeInterceptor,
    updateLocalEdgeData,
    openNodeEditor,
    closeNodeEditor,
    recommendConceptualEdges
  };
}
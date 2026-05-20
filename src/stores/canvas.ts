import { apiService } from '@/api/apiService';
import { POSITION_SCALE } from '@/constants/canvases';
import type { CanvasViewInstance, ConceptualEdge, ConceptualGraph, ConceptualNode, EdgeType } from '@/interfaces/conceptual-map';
import type { Connection } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    instances: new Map<string, CanvasViewInstance>(),
    activeCanvasId: '',
  }),

	getters: {
    current: (state) => state.instances.get(state.activeCanvasId),
  },

  actions: {
    async mountCanvas(id: string) {
      this.activeCanvasId = id;

      if (!this.instances.has(id)) {
        this.instances.set(id, {
          conceptualNodes: new Map(),
          conceptualEdges: [],
          isInterceptionActive: false,
          interceptorAction: 'create',
          interceptorPosition: { x: 0, y: 0 },
          pendingConnection: null,
          localEdgeData: {
            id: uuidv4(),
            label: '',
            type: 'REF',
            evidence: '',
            weight: 1.0,
            source: '',
            sourceHandle: '',
            target: '',
            targetHandle: '',
          },
              // --- Drag & Drop UI State ---
          isDragging: false,
          isDragOver: false,
          draggedNode: null as any | null,
          viewport: { x: 0, y: 0, zoom: 1 }
        });
      }
    },

    unmountCanvas(id: string) {
      this.instances.delete(id);
    },

    async setConceptualGraph(graph: ConceptualGraph) {
      if (!this.current) return;

      Object.entries(graph.nodes).map(([key, value]) => {
        value.position.x *= POSITION_SCALE;
        value.position.y *= POSITION_SCALE;
        this.current?.conceptualNodes.set(key, value);
      });

      this.current.conceptualEdges = graph.edges;
    },

    openInterceptor(connection: Connection | null, position: { x: number; y: number }, existingEdge?: ConceptualEdge) {
      if (!this.current) return;

      this.current.isInterceptionActive = true;
      this.current.pendingConnection = connection;
      this.current.interceptorPosition = position;

      if (existingEdge) {
        this.current.interceptorAction = 'update';
        this.current.localEdgeData = { ...existingEdge };
      } else if (connection) {
        this.current.interceptorAction = 'create';
        // Reset form
        this.current.localEdgeData = {
          id: uuidv4(),
          label: '',
          type: 'REF',
          evidence: '',
          weight: 1.0,
          source: connection.source,
          sourceHandle: connection.sourceHandle,
          target: connection.target,
          targetHandle: connection.targetHandle,
        };
      } else {
        // TODO: Handle case where connection is null (e.g., manual open for editing)
        this.closeInterceptor();
      }
    },

    closeInterceptor() {
      if (!this.current) return;

      this.current.isInterceptionActive = false;
      this.current.pendingConnection = null;
    },

    setInterceptionActivity(status: boolean) {
      if (!this.current) return;

      this.current.isInterceptionActive = status;
    },

    setDragStatus(status: { isDragging?: boolean; isDragOver?: boolean }) {
      if (!this.current) return;

      if (status.isDragging !== undefined) this.current.isDragging = status.isDragging;
      if (status.isDragOver !== undefined) this.current.isDragOver = status.isDragOver;
    },

    /** Handles updates for existing nodes, including moving, grouping, and editing */
    updateConceptualMapNode(node: ConceptualNode, action: 'move' | 'link' | 'edit' | 'delete' | 'group') {
      if (!this.current) return;

      if (action === 'delete') {
        this.current.conceptualNodes.delete(node.id);
        // Also delete related edges
        this.current.conceptualEdges = this.current.conceptualEdges.filter(e => e.source !== node.id && e.target !== node.id);
      } else if (action === 'group') {
        // Logic to create or update a Group Node (U.S. 7)
      } else {
        this.current.conceptualNodes.set(node.id, node);
      }
    },

    /** Handles edge creation, deletion, and label editing */
    async updateConceptualMapEdge(edge: ConceptualEdge, action: 'create' | 'delete' | 'update') {
      if (!this.current) return;

      if (action === 'create' || action === 'update') {
        const existingIndex = this.current.conceptualEdges.findIndex(e => e.id === edge.id);
        if (existingIndex !== -1) {
          let response = await apiService.canvases.edges.update(this.activeCanvasId, edge.id, edge);
          if (response.data) {
            this.current.conceptualEdges.push(response.data);
          }
          this.current.conceptualEdges[existingIndex] = edge;
        } else if (action === 'create') {
          let response = await apiService.canvases.edges.create(this.activeCanvasId, edge);
          if (response.data) {
            this.current.conceptualEdges.push(response.data);
          }
        }
      } else if (action === 'delete') {
        try {
          await apiService.canvases.edges.delete(this.activeCanvasId, edge.id);
          this.current.conceptualEdges = this.current.conceptualEdges.filter(e => e.id !== edge.id);
        } catch (error) {
          console.error('Failed!', error);
        }
      }
    },

    updateLocalEdgeData(patch: any) {
      if (!this.current) return;

      this.current.localEdgeData = { ...this.current.localEdgeData, ...patch };
    },
  }
});
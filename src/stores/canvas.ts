import { POSITION_SCALE } from '@/constants/canvases';
import type { CanvasState, ConceptualEdge, ConceptualGraph, ConceptualNode, EdgeType } from '@/interfaces/conceptual-map';
import type { Connection } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => ({
    // ---  ---
		conceptualNodes: new Map(),
		conceptualEdges: [],

    // --- Edge Interceptor State ---
    isInterceptionActive: false,
    interceptorAction: 'create',
    interceptorPosition: { x: 0, y: 0 },
    pendingConnection: null as Connection | null,

    // Local form state for the interceptor
    localEdgeData: {
      id: uuidv4(),
      label: '',
      type: 'REF' as EdgeType,
      evidence: '',
      weight: 1.0,
      source: uuidv4(),
      target: uuidv4()
    },

    // --- Drag & Drop UI State ---
    isDragging: false,
    isDragOver: false,
    draggedNode: null as any | null,
  }),

	getters: {
  },

  actions: {
    async setConceptualGraph(graph: ConceptualGraph) {
      Object.entries(graph.nodes).map(([key, value]) => {
        value.position.x *= POSITION_SCALE;
        value.position.y *= POSITION_SCALE;
        this.conceptualNodes.set(key, value);
      });
      this.conceptualEdges = graph.edges;
    },

    openInterceptor(connection: Connection | null, position: { x: number; y: number }, existingEdge?: ConceptualEdge) {
      this.isInterceptionActive = true;
      this.pendingConnection = connection;
      this.interceptorPosition = position;

      if (existingEdge) {
        this.interceptorAction = 'update';
        this.localEdgeData = { ...existingEdge };
      } else if (connection) {
        this.interceptorAction = 'create';
        // Reset form
        this.localEdgeData = {
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
      this.isInterceptionActive = false;
      this.pendingConnection = null;
    },

    setInterceptionActivity(status: boolean) {
      this.isInterceptionActive = status;
    },

    setDragStatus(status: { isDragging?: boolean; isDragOver?: boolean }) {
      if (status.isDragging !== undefined) this.isDragging = status.isDragging;
      if (status.isDragOver !== undefined) this.isDragOver = status.isDragOver;
    },

    /** Handles updates for existing nodes, including moving, grouping, and editing */
    updateConceptualMapNode(node: ConceptualNode, action: 'move' | 'link' | 'edit' | 'delete' | 'group') {
      if (action === 'delete') {
        this.conceptualNodes.delete(node.id);
        // Also delete related edges
        this.conceptualEdges = this.conceptualEdges.filter(e => e.source !== node.id && e.target !== node.id);
      } else if (action === 'group') {
        // Logic to create or update a Group Node (U.S. 7)
      } else {
        this.conceptualNodes.set(node.id, node);
      }
    },

    /** Handles edge creation, deletion, and label editing (U.S. 8) */
    updateConceptualMapEdge(edge: ConceptualEdge, action: 'create' | 'delete' | 'update') {
      if (action === 'create' || action === 'update') {
        const existingIndex = this.conceptualEdges.findIndex(e => e.id === edge.id);
        if (existingIndex !== -1) {
          this.conceptualEdges[existingIndex] = edge;
        } else if (action === 'create') {
          this.conceptualEdges.push(edge);
        }
      } else if (action === 'delete') {
        this.conceptualEdges = this.conceptualEdges.filter(e => e.id !== edge.id);
      }
    },

    updateLocalEdgeData(patch: any) {
      this.localEdgeData = { ...this.localEdgeData, ...patch };
    },
  }
});
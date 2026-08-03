/**
 * @file canvas.ts (Pinia Store)
 * @description Transformed into a pure passive Data Cache Layer.
 * Holds cold graph snapshots in memory to prevent redundant HTTP requests during page toggles,
 * completely decoupled from Vue Flow high-frequency reactive rendering loops.
 */
import { defineStore } from 'pinia';
import { apiService } from '@/api/apiService';
import type { ConceptualGraph } from '@/interfaces/conceptual-map';

export const useCanvasStore = defineStore('canvas', {
  state: () => ({
    // Use a primitive Map to store immutable data cache snapshots
    graphCacheRepository: new Map<string, ConceptualGraph>(),
  }),

  actions: {
    /**
     * Cache Reader
     */
    getGraphCache(id: string): ConceptualGraph | undefined {
      return this.graphCacheRepository.get(id);
    },

    /**
     * Cache Server: Fetches from backend API on cache-miss and commits to memory
     */
    async fetchAndCacheGraph(id: string): Promise<ConceptualGraph> {
      try {
        const response = await apiService.canvases.graphs.get(id);
        const graphData = response.data || { nodes: {}, edges: [] };

        // Write cold data into global storage repository
        this.graphCacheRepository.set(id, graphData);
        return graphData;
      } catch (error) {
        console.error(`[Pinia Cache System Error] Failed to load canvas ${id}:`, error);
        throw error;
      }
    },

    /**
     * Direct Cache Mutator: Updates the cold storage snapshot when context persists changes
     */
    updateCacheSnapshot(id: string, graph: ConceptualGraph) {
      this.graphCacheRepository.set(id, graph);
    },

    /**
     * Cache Invalidator: Forces a reload on next mount
     */
    invalidateCache(id: string) {
      this.graphCacheRepository.delete(id);
    }
  }
});
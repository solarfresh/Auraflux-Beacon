import type { Embedding, ModelOption } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { useProviderStore } from '@auraflux/shared-core/stores/provider';
import { defineStore } from 'pinia';
import { apiService } from '@/api/apiService';

interface EmbeddingState {
  embeddings: Embedding[];
  currentEmbeddingId: ID | null;
  currentProjectId: ID | null;
  isLoading: boolean;
  error: string | null;
}

export const useEmbeddingStore = defineStore('embedding', {
  state: (): EmbeddingState => ({
    embeddings: [],
    currentEmbeddingId: null,
    currentProjectId: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    embeddingMap: (state) => new Map<ID, Embedding>(state.embeddings.map((e) => [e.id, e])),

    currentEmbedding: (state): Embedding | null => {
      if (!state.currentEmbeddingId) return null;
      return state.embeddings.find((e) => e.id === state.currentEmbeddingId) || null;
    },

    /**
     * Dynamically derive model options for the currently selected embedding
     * by cross-referencing the useProviderStore.
     */
    currentAvailableModelOptions(): ModelOption[] {
      const providerStore = useProviderStore();
      const providerId = this.currentEmbedding?.providerId || null;
      return providerStore.getModelOptionsByProviderId(providerId);
    },
  },

  actions: {
    /**
     * Fetch embedding configurations for a specific project.
     */
    async fetchEmbeddingsByProject(projectId: ID): Promise<void> {
      this.currentProjectId = projectId;
      this.isLoading = true;
      this.error = null;

      try {
        // const response = await apiService.projects.embeddings.get(this.currentProjectId);

        // if (response.data) {
        //   this.embeddings = Array.isArray(response.data)
        //     ? response.data
        //     : [response.data];
        // }

        // if (this.embeddings.length > 0 && !this.currentEmbeddingId) {
        //   this.currentEmbeddingId = this.embeddings[0].id;
        // }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch embedding configurations';
      } finally {
        this.isLoading = false;
      }
    },

    setCurrentEmbeddingId(embeddingId: ID | null): void {
      this.currentEmbeddingId = embeddingId;
    },

    /**
     * Update current embedding configuration.
     */
    async updateCurrentEmbedding(payload: Partial<Embedding>): Promise<void> {
      if (!this.currentEmbeddingId || !this.currentEmbedding || !this.currentProjectId) return;

      this.isLoading = true;
      try {
        // const response = await apiService.projects.embeddings.update(
        //   this.currentProjectId,
        //   this.currentEmbeddingId,
        //   payload
        // );
        // if (response.data) {
        //   const index = this.embeddings.findIndex((e) => e.id === this.currentEmbeddingId);
        //   if (index !== -1) this.embeddings[index] = response.data;
        // }
      } catch (err: any) {
        this.error = err.message || 'Failed to update embedding configuration';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
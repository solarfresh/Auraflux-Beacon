import { defineStore } from 'pinia';
import type { ModelProvider, ProviderOption, ModelOption } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiService } from '@auraflux/shared-core/api/apiService';

interface ProviderState {
  providers: ModelProvider[];
  isLoading: boolean;
  error: string | null;
}

export const useProviderStore = defineStore('provider', {
  state: (): ProviderState => ({
    providers: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Map for O(1) provider lookup.
     */
    providerMap: (state) => {
      return new Map<ID, ModelProvider>(state.providers.map((p) => [p.id, p]));
    },

    /**
     * General dropdown options for all providers.
     */
    providerOptions: (state): ProviderOption[] => {
      return state.providers.map((p) => ({
        label: p.name,
        value: p.id,
      }));
    },

    /**
     * Helper getter: Get supported models for a specific provider ID.
     */
    getModelOptionsByProviderId: (state) => {
      return (providerId: ID | null): ModelOption[] => {
        if (!providerId) return [];
        const provider = state.providers.find((p) => p.id === providerId);
        if (!provider) return [];

        return provider.supportedFamilies.map((family) => ({
          label: family.displayName,
          value: family.id,
          providerId: provider.id,
        }));
      };
    },
  },

  actions: {
    async fetchProviders(): Promise<void> {
      if (this.providers.length > 0) return;

      this.isLoading = true;
      try {
        const response = await apiService.auth.agents.models.get();
        if (response.data) {
          this.providers = response.data;
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch providers';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
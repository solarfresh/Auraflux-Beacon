import type { Agent } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { useProviderStore } from '@auraflux/shared-core/stores/provider';
import type { ModelOption } from '@auraflux/design-system/interfaces/agents';
import { defineStore } from 'pinia';
import { apiService } from '@/api/apiService';

interface AgentState {
  agents: Agent[];
  currentAgentId: ID | null;
  currentProjectId: ID | null;
  isLoading: boolean;
  error: string | null;
}

export const useAgentStore = defineStore('agent', {
  state: (): AgentState => ({
    agents: [],
    currentAgentId: null,
    currentProjectId: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    agentMap: (state) => new Map<ID, Agent>(state.agents.map((a) => [a.id, a])),

    currentAgent: (state): Agent | null => {
      if (!state.currentAgentId) return null;
      return state.agents.find((a) => a.id === state.currentAgentId) || null;
    },

    /**
     * Dynamically derive model options for the currently selected agent
     * by cross-referencing the useProviderStore.
     */
    currentAvailableModelOptions(): ModelOption[] {
      const providerStore = useProviderStore();
      const providerId = this.currentAgent?.providerId || null;
      return providerStore.getModelOptionsByProviderId(providerId);
    },
  },

  actions: {
    /**
     * Fetch agents for a specific project.
     */
    async fetchAgentsByProject(projectId: ID): Promise<void> {
      this.currentProjectId = projectId;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await apiService.projects.agents.get(this.currentProjectId);

        if (response.data) {
          this.agents = response.data;
        }

        if (this.agents.length > 0 && !this.currentAgentId) {
          this.currentAgentId = this.agents[0].id;
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch agents';
      } finally {
        this.isLoading = false;
      }
    },

    setCurrentAgentId(agentId: ID | null): void {
      this.currentAgentId = agentId;
    },

    /**
     * Update current agent config.
     */
    async updateCurrentAgent(payload: Partial<Agent>): Promise<void> {
      if (!this.currentAgentId || !this.currentAgent) return;

      this.isLoading = true;
      try {
        // const updated = await apiService.agents.update(this.currentAgentId, payload);
        // const index = this.agents.findIndex(a => a.id === this.currentAgentId);
        // if (index !== -1) this.agents[index] = updated;
      } catch (err: any) {
        this.error = err.message || 'Failed to update agent';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
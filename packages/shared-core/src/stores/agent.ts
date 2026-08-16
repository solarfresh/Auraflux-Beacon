import type { Agent, ModelOption, ModelProvider, ProviderOption } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';
// import { apiService } from '@auraflux/shared-core/api/apiService';
import { defineStore } from 'pinia';

interface AgentState {
  agents: Agent[];
  providers: ModelProvider[];
  currentAgentId: ID | null;
  /**
   * Flag indicating whether the current agent configuration has unpersisted changes.
   */
  isLoading: boolean;
  error: string | null;
}

export const useAgentStore = defineStore('agent', {
  state: (): AgentState => ({
    agents: [
      {
        id: 'agent-01',
        name: '🔍 Triple Extractor',
        purpose: 'Extract SPO triples and tags from unstructured text.',
        status: 'DRAFT',
        providerId: 'provider-openai-01',
        modelFamilyId: 'mf-gpt-4o-mini',
        systemPrompt: 'You are an expert NLP parser. Output valid JSON triples.',
        promptTemplate: 'Extract entities and relations from: {{input_text}}',
        templateVariables: [
          { name: 'input_text', description: 'Raw document text', required: true },
        ],
        llmParameters: {
          temperature: 0.2,
          topP: 0.95,
          maxTokens: 2048,
        },
        outputSchema: {
          type: 'object',
          properties: {
            triples: { type: 'array' },
          },
        },
      },
      {
        id: 'agent-02',
        name: '🛡️ Schema Validator',
        purpose: 'Verify output JSON schema structure and field constraints.',
        status: 'REVIEW',
        providerId: 'provider-anthropic-01',
        modelFamilyId: 'mf-claude-haiku',
        systemPrompt: 'Validate incoming JSON against the strict schema definition.',
        promptTemplate: 'Validate payload: {{payload}} against schema: {{schema}}',
        templateVariables: [
          { name: 'payload', description: 'JSON string', required: true },
          { name: 'schema', description: 'Schema JSON string', required: true },
        ],
        llmParameters: {
          temperature: 0.0,
          maxTokens: 1024,
        },
      },
    ],
    providers: [
      {
        id: 'provider-openai-01',
        name: 'Production OpenAI',
        type: 'OPENAI',
        status: 'ONLINE',
        apiKeyFingerprint: '••••4n2z',
        latencyMs: 120,
        lastVerifiedAt: '2026-08-15T10:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-08-15T00:00:00Z',
        supportedFamilies: [
          {
            id: 'mf-gpt-4o-mini',
            name: 'gpt-4o-mini',
            displayName: 'GPT-4o Mini',
            description: 'Fast and lightweight model for efficient tasks.',
            inputTokenLimit: 128000,
            outputTokenLimit: 16384,
          },
          {
            id: 'mf-gpt-4o',
            name: 'gpt-4o',
            displayName: 'GPT-4o',
            description: 'Flagship high-intelligence model.',
            inputTokenLimit: 128000,
            outputTokenLimit: 16384,
          },
        ],
      },
      {
        id: 'provider-anthropic-01',
        name: 'Production Anthropic',
        type: 'ANTHROPIC',
        status: 'ONLINE',
        apiKeyFingerprint: '••••9x1a',
        latencyMs: 180,
        lastVerifiedAt: '2026-08-15T10:00:00Z',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: '2026-08-15T00:00:00Z',
        supportedFamilies: [
          {
            id: 'mf-claude-haiku',
            name: 'claude-3-5-haiku',
            displayName: 'Claude 3.5 Haiku',
            description: 'Fast and intelligent lightweight model.',
            inputTokenLimit: 200000,
            outputTokenLimit: 8192,
          },
          {
            id: 'mf-claude-sonnet',
            name: 'claude-3-5-sonnet',
            displayName: 'Claude 3.5 Sonnet',
            description: 'Most intelligent Claude model for complex reasoning.',
            inputTokenLimit: 200000,
            outputTokenLimit: 8192,
          },
        ],
      },
    ],
    currentAgentId: 'agent-01',
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Map of agents keyed by ID for O(1) fast lookup.
     */
    agentMap: (state) => {
      const map = new Map<ID, Agent>();
      for (const agent of state.agents) {
        map.set(agent.id, agent);
      }
      return map;
    },

    /**
     * Returns the currently active agent entity.
     */
    currentAgent: (state): Agent | null => {
      if (!state.currentAgentId) return null;
      return state.agents.find((a) => a.id === state.currentAgentId) || null;
    },

    /**
     * Formats providers into options suitable for dropdown UI components.
     */
    providerOptions(): ProviderOption[] {
      const defaultOption = { label: 'Select Provider...', value: '' };
      const options = this.providers.map((p) => ({
        label: p.name,
        value: p.id,
      }));

      if (!this.currentAgent?.providerId) {
        options.unshift(defaultOption);
      }

      return options.length > 0 ? options : [defaultOption]
    },

    selectedProviderId(): ID {
      return this.currentAgent?.providerId || '';
    },

    /**
     * Formats model families into options suitable for dropdown UI components.
     */
    modelOptions(): ModelOption[] {
      const defaultOption = { label: 'Select Model...', value: '', providerId: '' };

      if (!this.selectedProviderId) return [defaultOption];

      const index = this.providers.findIndex((a) => a.id === this.selectedProviderId);
      if (index !== -1) {
        const provider = this.providers[index];

        const options: ModelOption[] = [];
        for (const family of provider.supportedFamilies) {
          options.push({
            label: family.displayName,
            value: family.id,
            providerId: provider.id,
          });
        }

        if (!this.currentAgent?.modelFamilyId) {
          options.unshift(defaultOption);
        }

        return options.length ? options : [defaultOption];
      } else {
        return [defaultOption];
      }
    },

    selectedModelFamilyId(): ID {
      return this.currentAgent?.modelFamilyId || '';
    },

  },

  actions: {
    /**
     * Fetches all agents from the API.
     */
    async fetchAgents(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        // const response = await apiService.agents.getAll();
        // if (response.data) {
        //   this.agents = response.data;

        //   // Automatically set the first agent as active if none is selected
        //   if (this.agents.length > 0 && !this.currentAgentId) {
        //     this.setCurrentAgentId(this.agents[0].id);
        //   }
        // }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Fetches all model providers from the API.
     */
    async fetchProviders(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        // const response = await apiService.providers.getAll();
        // if (response.data) {
        //   this.providers = response.data;
        // }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Sets the current agent ID and synchronizes selected provider/model states.
     */
    setCurrentAgentId(agentId: ID | null): void {
      this.currentAgentId = agentId;
    },

    /**
     * Updates the selected provider and automatically selects its first available model family.
     */
    setSelectedProviderId(providerId: ID): void {
      const index = this.agents.findIndex((a) => a.id === this.currentAgentId);
      if (index !== -1) {
        const agent = this.agents[index];
        agent.providerId = providerId;
      };
    },

    /**
     * Updates the selected model family ID.
     */
    setSelectedModelFamilyId(modelFamilyId: ID): void {
      const index = this.agents.findIndex((a) => a.id === this.currentAgentId);
      if (index !== -1) {
        const agent = this.agents[index];
        agent.modelFamilyId = modelFamilyId;
      };
    },

    /**
     * Updates the entity status of the current active agent.
     */
    async updateCurrentAgentStatus(status: EntityStatus): Promise<void> {
      if (!this.currentAgentId) return;

      const agent = this.agents.find((a) => a.id === this.currentAgentId);
      if (agent) {
        agent.status = status;
      }
    },

    /**
     * Persists the current agent configuration changes to the backend.
     */
    async saveCurrentAgent(): Promise<void> {
      if (!this.currentAgentId || !this.currentAgent) return;

      this.isLoading = true;
      this.error = null;

      const payload: Partial<Agent> = {
        ...this.currentAgent,
        providerId: this.selectedProviderId || this.currentAgent.providerId,
        modelFamilyId: this.selectedModelFamilyId || this.currentAgent.modelFamilyId,
      };

      try {
        // const response = await apiService.agents.update(this.currentAgentId, payload);
        // if (response.data) {
        //   const index = this.agents.findIndex((a) => a.id === this.currentAgentId);
        //   if (index !== -1) {
        //     this.agents[index] = response.data;
        //   }
        // }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
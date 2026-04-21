import config from '@/config';
import { apiService } from '@/api/apiService';
import type { ID } from '@/interfaces/core';
import type { Agent, ModelProvider } from '@/interfaces/agents';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { debounce } from 'lodash-es';
import { ConnectStatus } from '@/interfaces/core';

export const useAgentStore = defineStore('agent', () => {
  // --- State (Refs) ---
  const agents = ref<Map<string, Agent>>(new Map());
  const providers = ref<Map<string, ModelProvider>>(new Map());
  const connectStatus = ref<ConnectStatus>('IDLE');

  const currentAgentId = ref<ID | null>(null);

  const currentAgent = computed(() => agents.value.get(currentAgentId.value || ''));
  const currentProviderId = computed({
    get: () => currentAgent.value?.llmParameters.provider || '',
    set: (val) => {
      let agent = agents.value.get(currentAgentId.value || '');
      if (agent) {
        agent.llmParameters.provider = val;
      }
    }
  });
  const currentModelProvider = computed(() => providers.value.get(currentProviderId.value || ''));

  async function createModelProvider (provider: Partial<ModelProvider>) {
    const response = await apiService.agents.createModelProvider(provider);
    if (response.data) {
      providers.value.set(response.data.id, response.data);
    }
  }

  async function getAvailableModels (providerType: string, apiKey: string, providerId?: ID) {
    const response = await apiService.agents.getAvailableModels(providerType.toLowerCase(), apiKey, providerId);
    if (response.data) {
      return response.data;
    }
  }

  async function loadProviders () {
    const response = await apiService.agents.getModelProviders();
    if (response.data) {
      response.data.map(provider => {
        providers.value.set(provider.id, provider);
      });
    }
  }

  async function loadAgents() {
    try {
      let response = await apiService.agents.getAgents();
      if (response.data) {
        response.data.map(agent => {
          agents.value.set(agent.id, agent);
        });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  async function loadAgentDetail(agentId: ID) {
    currentAgentId.value = agentId;

    try {
      let response = await apiService.agents.getAgentDetail(agentId);
      if (response.data) {
        agents.value.set(response.data.id, response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(`Failed to load a project: ${agentId}`, error);
    }
  }

  const updateAgent = async () => {
    if (!currentAgent.value) return;
    if (connectStatus.value === 'ACTIVE') return;

    connectStatus.value = 'ACTIVE';
    try {
      await apiService.agents.updateAgentDetail(currentAgent.value.id, currentAgent.value);
      connectStatus.value = 'IDLE';
    } catch (error) {
      connectStatus.value = 'ERROR';
    }
  };

  const debouncedUpdateAgent = debounce(updateAgent, config.DEBOUNCE_TIME || 500);

  async function updateModelProvider(provider: Partial<ModelProvider>) {
    if (provider.id === undefined) return;

    const response = await apiService.agents.updateModelProvider(provider.id, provider);
    if (response.data) {
      providers.value.set(response.data.id, response.data);
    }
  }

  async function setCurrentAgentId(agentId: ID) {
    currentAgentId.value = agentId;
  };

  async function setCurrentProviderId(providerId: ID | null) {
    if (providerId && currentAgentId.value) {
      currentProviderId.value = providerId;
    }
  };

  return {
    agents,
    providers,
    connectStatus,
    currentAgentId,
    currentProviderId,
    // Getters
    currentAgent,
    currentModelProvider,
    // Actions
    createModelProvider,
    debouncedUpdateAgent,
    getAvailableModels,
    loadAgents,
    loadAgentDetail,
    loadProviders,
    updateModelProvider,
    setCurrentAgentId,
    setCurrentProviderId
  }
});
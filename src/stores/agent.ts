import config from '@/config';
import { apiService } from '@/api/apiService';
import type { ID } from '@/interfaces/core';
import type { Agent, ModelProvider } from '@/interfaces/agents';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { debounce } from 'lodash-es';

export const useAgentStore = defineStore('agent', () => {
  // --- State (Refs) ---
  const agents = ref<Map<string, Agent>>(new Map());
  const providers = ref<Map<string, ModelProvider>>(new Map());

  const currentAgentId = ref<ID | null>(null);
  const currentAgent = computed(() => agents.value.get(currentAgentId.value || ''));

  async function createModelProvider (provider: ModelProvider) {
    const response = await apiService.agents.createModelProvider(provider);
    if (response.data) {
      providers.value.set(response.data.id, response.data);
    }
  }

  async function getAvailableModels (providerType: string, apiKey: string) {
    const response = await apiService.agents.getAvailableModels(providerType.toLowerCase(), apiKey);
    if (response.data) {
      return response.data;
    }
  }

  async function loadProviders () {
    const response = await apiService.agents.getModelProviders();
    if (response.data) {
      response.data.map(provider => {
        provider.supportedFamilies = [];
        providers.value.set(provider.id, provider);
      });
    }
  }

  async function verifyProvider(id: ID) {

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

  async function updateAgent(field: keyof Agent, value: any) {
    let agent = agents.value.get(currentAgentId.value || '');
    if (agent === undefined || agent === null) return;

    agent[field] = value;

    debounce(async (field: keyof Agent, value: any) => {
      console.log(`update: id-${currentAgentId} field-${field} value-${value}`)
    }, config.DEBOUNCE_TIME || 500);
  };

  async function setCurrentAgentId(agentId: ID) {
    currentAgentId.value = agentId;
  };

  return {
    agents,
    providers,
    currentAgentId,
    // Getters
    currentAgent,
    // Actions
    createModelProvider,
    getAvailableModels,
    loadAgents,
    loadAgentDetail,
    loadProviders,
    updateAgent,
    setCurrentAgentId,
    verifyProvider,
  }
});
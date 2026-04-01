import { apiService } from '@/api/apiService';
import type { ID } from '@/interfaces/core';
import type { Agent } from '@/interfaces/agents';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAgentStore = defineStore('agent', () => {
  // --- State (Refs) ---
  const agents = ref<Map<string, Agent>>(new Map());

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

  return {
    agents,
    // Getters
    // Actions
    loadAgents,
    loadAgentDetail,
  }
});
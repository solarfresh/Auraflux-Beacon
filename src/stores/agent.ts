import type { ID } from '@/interfaces/core';
import type { Agent } from '@/interfaces/agents';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAgentStore = defineStore('agent', () => {
  // --- State (Refs) ---
  const agents = ref<Map<string, Agent>>(new Map());

  async function loadAgents() {

  };

  return {
    agents,
    // Getters
    // Actions
    loadAgents,
  }
});
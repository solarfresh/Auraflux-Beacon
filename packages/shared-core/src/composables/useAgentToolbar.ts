import { computed } from 'vue';
import { useAgentStore } from '@auraflux/shared-core/stores/agent';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';
import type { Agent } from '@auraflux/design-system/interfaces/agents';

export function useAgentToolbar() {
  const agentStore = useAgentStore();

  const agents = computed(() => agentStore.agents);
  const selectedProvider = computed(() => agentStore.selectedProviderId);
  const selectedModel = computed(() => agentStore.selectedModelFamilyId);
  const providerOptions = computed(() => agentStore.providerOptions);
  const modelOptions = computed(() => agentStore.modelOptions);

  const handleSaveAgent = () => {
    agentStore.saveCurrentAgent();
  };

  const handleSelectAgent = (agent: Agent) => {
    agentStore.setCurrentAgentId(agent.id);
  };

  const handleStatusChange = (status: EntityStatus) => {
    agentStore.updateCurrentAgentStatus(status);
  };

  const handleUpdateSelectedProvider = (providerId: ID) => {
    agentStore.setSelectedProviderId(providerId);
  };

  const handleUpdateSelectedModel = (modelFamilyId: ID) => {
    agentStore.setSelectedModelFamilyId(modelFamilyId);
  };

  return {
    agents,
    selectedProvider,
    selectedModel,
    providerOptions,
    modelOptions,

    handleSaveAgent,
    handleSelectAgent,
    handleStatusChange,
    handleUpdateSelectedProvider,
    handleUpdateSelectedModel,
  };
}
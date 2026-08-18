import { useAgentStore } from '@auraflux/shared-core/stores/agent';
import { storeToRefs } from 'pinia';
import { computed, nextTick, ref, watch } from 'vue';

import type { Agent, DynamicVariable, PromptSchemaFormData } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export function useAgentBench() {
  const store = useAgentStore();

  // Deconstruct reactive state and getters directly from Pinia store
  const {
    agents,
    providers,
    currentAgent,
    providerOptions,
    modelOptions,
    selectedProviderId,
    selectedModelFamilyId,
    isLoading: isStoreLoading,
  } = storeToRefs(store);

  // --- Local UI States ---
  const isExecuting = ref(false);
  const isDirty = ref(false);
  const activeVariableValues = ref<Record<string, string>>({});

  // Execution & Metric States (Initialized empty, populated post-run)
  const isSchemaValid = ref(true);
  const isSyncing = ref(false);
  const responseOutput = ref<Record<string, unknown> | string>({});
  const rawMarkdownOutput = ref<string>('');
  const metrics = ref<{ latency?: number; tokens?: number } | undefined>(undefined);

  const selectedAgent = ref<Partial<Agent>>({
    id: '',
    name: '',
    status: 'DRAFT',
    providerId: selectedProviderId.value,
    modelFamilyId: selectedModelFamilyId.value,
  });

  const promptFormData = ref<PromptSchemaFormData>({
    purpose: '',
    systemPrompt: '',
    promptTemplate: '',
    schemaFields: [],
  });

  // Synchronize form values whenever currentAgent in the store changes
  watch(
    () => currentAgent.value,
    (agent) => {
      if (agent) {
        isSyncing.value = true;

        selectedAgent.value = {
          id: agent.id || '',
          name: agent.name || '',
          status: agent.status || 'DRAFT',
          providerId: agent.providerId || '',
          modelFamilyId: agent.modelFamilyId || ''
        }

        promptFormData.value = {
          purpose: agent.purpose || '',
          systemPrompt: agent.systemPrompt || '',
          promptTemplate: agent.promptTemplate || '',
          schemaFields: agent.outputSchema?.properties
            ? Object.keys(agent.outputSchema.properties).map((key, idx) => ({
                id: `field-${idx}`,
                name: key,
                type: agent.outputSchema?.properties?.[key]?.type || 'String',
                badgeText: 'Required',
                badgeIntent: 'neutral',
              }))
            : [],
        };

        nextTick(() => {
          isSyncing.value = false;
          isDirty.value = false;
        });
      } else {
        selectedAgent.value = {
          id: '',
          name: '',
          status: 'DRAFT',
          providerId: '',
          modelFamilyId: '',
        }

        promptFormData.value = {
          purpose: '',
          systemPrompt: '',
          promptTemplate: '',
          schemaFields: [],
        };
      }
    },
    { immediate: true, deep: true }
  );

  // Track unsaved local form edits
  watch(
    promptFormData,
    () => {
      if (isSyncing.value) return;
      isDirty.value = true;
    },
    { deep: true }
  );

  /** Dynamically parse {{ variable_name }} syntax from template string */
  const parsedVariables = computed<DynamicVariable[]>(() => {
    const template = promptFormData.value.promptTemplate || '';
    const matches = template.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g);

    if (!matches) return [];

    const uniqueNames = Array.from(
      new Set(matches.map((m) => m.replace(/\{\{\s*|\s*\}\}/g, '')))
    );

    return uniqueNames.map((name) => ({
      name,
      type: 'string',
      multiline: name.includes('text') || name.includes('payload') || name.includes('schema'),
      defaultValue: activeVariableValues.value[name] || '',
    }));
  });

  const hasOutputSchema = computed(() => {
    return (promptFormData.value.schemaFields?.length || 0) > 0;
  });

  // --- Event & Action Handlers ---

  const handleSelectAgent = (agent: Agent) => {
    if (currentAgent.value?.id === agent.id) return;

    if (isDirty.value) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to switch agents? Your changes will be lost.'
      );

      if (!confirmLeave) return;
    }

    store.setCurrentAgentId(agent.id);
    isDirty.value = false;
  };

  const handleStatusChange = async (status: EntityStatus) => {
    if (isSyncing.value) return;
    selectedAgent.value.status = status;
    isDirty.value = true;
  };

  const handleProviderChange = (providerId: ID) => {
    if (isSyncing.value) return;
    selectedAgent.value.providerId = providerId;
    isDirty.value = true;
  };

  const handleModelChange = (modelId: ID) => {
    if (isSyncing.value) return;
    selectedAgent.value.modelFamilyId = modelId;
    isDirty.value = true;
  };

  const handleSave = async () => {
    const updatedAgent = {
      ...selectedAgent.value,
      ...promptFormData.value
    }
    await store.saveCurrentAgent(updatedAgent);
    isDirty.value = false;
  };

  const handleVariableValuesChange = (values: Record<string, string>) => {
    activeVariableValues.value = values;
  };

  /** Trigger Agent Test Execution */
  const handleRunTest = async () => {
    isExecuting.value = true;
    try {
      // Trigger API service or execution pipeline here
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      isExecuting.value = false;
    }
  };

  return {
    // States & Ref Bindings
    isDirty,
    isExecuting,
    isStoreLoading,
    agents,
    selectedAgent,
    providers,
    providerOptions,
    modelOptions,
    promptFormData,
    isSchemaValid,
    responseOutput,
    rawMarkdownOutput,
    metrics,

    // Computeds
    parsedVariables,
    hasOutputSchema,

    // Handlers
    handleSelectAgent,
    handleStatusChange,
    handleProviderChange,
    handleModelChange,
    handleSave,
    handleVariableValuesChange,
    handleRunTest,
  };
}
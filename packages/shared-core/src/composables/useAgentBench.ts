import { useAgentStore } from '@auraflux/shared-core/stores/agent';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

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
  const disabled = ref(false);
  const activeVariableValues = ref<Record<string, string>>({});

  // Execution & Metric States (Initialized empty, populated post-run)
  const isSchemaValid = ref(true);
  const responseOutput = ref<Record<string, unknown> | string>({});
  const rawMarkdownOutput = ref<string>('');
  const metrics = ref<{ latency?: number; tokens?: number } | undefined>(undefined);

  // --- Prompt Form Data State (Synchronized with currentAgent) ---
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
      } else {
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
      isDirty.value = true;
    },
    { deep: true }
  );

  // --- Computed Properties ---

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
    store.setCurrentAgentId(agent.id);
  };

  const handleStatusChange = async (status: EntityStatus) => {
    await store.updateCurrentAgentStatus(status);
  };

  const handleProviderChange = (providerId: ID) => {
    store.setSelectedProviderId(providerId);
    isDirty.value = true;
  };

  const handleModelChange = (modelId: ID) => {
    store.setSelectedModelFamilyId(modelId);
    isDirty.value = true;
  };

  const handlePromptFormUpdate = (updatedData: PromptSchemaFormData) => {
    promptFormData.value = updatedData;

    // Keep active agent instance in sync within current memory state
    if (currentAgent.value) {
      currentAgent.value.purpose = updatedData.purpose;
      currentAgent.value.systemPrompt = updatedData.systemPrompt;
      currentAgent.value.promptTemplate = updatedData.promptTemplate;
    }
  };

  const handleSave = async () => {
    await store.saveCurrentAgent();
    isDirty.value = false;
  };

  const handleEdit = () => {
    disabled.value = false;
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
    disabled,
    isDirty,
    isExecuting,
    isStoreLoading,
    agents,
    providers,
    providerOptions,
    modelOptions,
    selectedProviderId,
    selectedModelFamilyId,
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
    handlePromptFormUpdate,
    handleSave,
    handleEdit,
    handleVariableValuesChange,
    handleRunTest,
  };
}
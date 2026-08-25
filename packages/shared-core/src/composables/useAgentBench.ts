import { useProviderStore } from '@auraflux/shared-core/stores/provider';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';

import type { Agent, DynamicVariable, PromptSchemaFormData } from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

interface AgentBenchAdapter {
  /** Reactive reference to the currently selected agent entity */
  currentAgent: Ref<Agent | null>;
  /** Reactive list of all agents in the current module scope */
  agents: Ref<Agent[]>;
  /** External loading state flag */
  isLoading?: Ref<boolean>;

  /** Handler invoked when selecting a different agent */
  onSelectAgent: (agentId: ID) => void;
  /** Handler invoked to persist agent updates */
  onSaveAgent: (agentPayload: Partial<Agent>) => Promise<void>;
  /** Optional handler invoked to execute an agent test */
  onRunTest?: (agentPayload: Partial<Agent>, variables: Record<string, string>) => Promise<void>;
}

export function useAgentBench(adapter: AgentBenchAdapter) {
  const providerStore = useProviderStore();

  const { providerOptions, isLoading: isProviderLoading } = storeToRefs(providerStore);
  const { currentAgent, agents, isLoading: isAdapterLoading } = adapter;

  const isExecuting = ref(false);
  const isDirty = ref(false);
  const isSyncing = ref(false);
  const isSchemaValid = ref(true);

  const activeVariableValues = ref<Record<string, string>>({});
  const responseOutput = ref<Record<string, unknown> | string>({});
  const rawMarkdownOutput = ref<string>('');
  const metrics = ref<{ latency?: number; tokens?: number } | undefined>(undefined);

  const selectedAgent = ref<Partial<Agent>>({
    id: '',
    name: '',
    status: 'DRAFT',
    providerId: '',
    modelFamilyId: '',
  });

  const promptFormData = ref<PromptSchemaFormData>({
    purpose: '',
    systemPrompt: '',
    promptTemplate: '',
    schemaFields: [],
  });

  const modelOptions = computed(() => {
    const currentProviderId = selectedAgent.value.providerId;
    return providerStore.getModelOptionsByProviderId(currentProviderId || null);
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

  const isLoading = computed(() => isProviderLoading.value || (isAdapterLoading?.value ?? false));

  // --- Event & Action Handlers ---

  const handleSelectAgent = (agent: Agent) => {
    if (currentAgent.value?.id === agent.id) return;

    if (isDirty.value) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to switch agents? Your changes will be lost.'
      );

      if (!confirmLeave) return;
    }

    adapter.onSelectAgent(agent.id);
    isDirty.value = false;
  };

  const handleStatusChange = async (status: EntityStatus) => {
    if (isSyncing.value) return;
    selectedAgent.value.status = status;
  };

  const handleProviderChange = (providerId: ID) => {
    if (isSyncing.value) return;
    selectedAgent.value.providerId = providerId;
    selectedAgent.value.modelFamilyId = '';
  };

  const handleModelChange = (modelId: ID) => {
    if (isSyncing.value) return;
    selectedAgent.value.modelFamilyId = modelId;
  };

  const handleSave = async () => {
    const selectedModel = modelOptions.value.find(
      (m) => m.value === selectedAgent.value?.modelFamilyId
    );
    const payload: Partial<Agent> = {
      ...selectedAgent.value,
      purpose: promptFormData.value.purpose,
      systemPrompt: promptFormData.value.systemPrompt,
      promptTemplate: promptFormData.value.promptTemplate,
      llmParameters: {
        ...selectedAgent.value?.llmParameters,
        provider: selectedAgent.value?.providerId ?? '',
        model: selectedModel?.name ?? '',
      },
    };

    await adapter.onSaveAgent(payload);
    isDirty.value = false;
  };

  const handleVariableValuesChange = (values: Record<string, string>) => {
    activeVariableValues.value = values;
  };

  /** Trigger Agent Test Execution */
  const handleRunTest = async () => {
    if (!adapter.onRunTest) return;

    isExecuting.value = true;
    try {
      const selectedModel = modelOptions.value.find(
        (m) => m.value === selectedAgent.value?.modelFamilyId
      );
      const payload: Partial<Agent> = {
        ...selectedAgent.value,
        purpose: promptFormData.value.purpose,
        systemPrompt: promptFormData.value.systemPrompt,
        promptTemplate: promptFormData.value.promptTemplate,
        llmParameters: {
          ...selectedAgent.value?.llmParameters,
          provider: selectedAgent.value?.providerId ?? '',
          model: selectedModel?.name ?? '',
        },
      };
      await adapter.onRunTest(payload, activeVariableValues.value);
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
    isLoading,
    agents,
    selectedAgent,
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
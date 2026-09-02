import { useProviderStore } from '@auraflux/shared-core/stores/provider';
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';

import type {
  Agent,
  DynamicVariable,
  Embedding,
  EmbeddingFormData,
  PromptSchemaFormData,
} from '@auraflux/design-system/interfaces/agents';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

interface AgentBenchAdapter {
  /** Reactive reference to the currently selected agent entity */
  currentAgent?: Ref<Agent | null>;
  /** Reactive list of all agents in the current module scope */
  agents?: Ref<Agent[]>;
  /** Reactive reference to the currently selected embedding entity */
  currentEmbedding?: Ref<Embedding | null>;
  /** Reactive list of all embeddings in the current module scope */
  embeddings?: Ref<Embedding[]>;

  /** External loading state flag */
  isLoading?: Ref<boolean>;

  /** Handler invoked when selecting a target (Agent or Embedding) */
  onSelectTarget: (targetId: ID, type: 'AGENT' | 'EMBEDDING') => void;
  /** Handler invoked to persist agent updates */
  onSaveAgent?: (agentPayload: Partial<Agent>) => Promise<void>;
  /** Handler invoked to persist embedding updates */
  onSaveEmbedding?: (embeddingPayload: Partial<Embedding>) => Promise<void>;
  /** Optional handler invoked to execute an agent or search test */
  onRunTest?: (payload: Partial<Agent> | Partial<Embedding>, variables: Record<string, string>) => Promise<void>;
}

export function useAgentBench(adapter: AgentBenchAdapter) {
  const providerStore = useProviderStore();

  const { providerOptions, isLoading: isProviderLoading } = storeToRefs(providerStore);
  const {
    currentAgent,
    agents = ref([]),
    currentEmbedding,
    embeddings = ref([]),
    isLoading: isAdapterLoading,
  } = adapter;

  const isExecuting = ref(false);
  const isDirty = ref(false);
  const isSyncing = ref(false);
  const isSchemaValid = ref(true);

  const activeVariableValues = ref<Record<string, string>>({});
  const responseOutput = ref<Record<string, unknown> | string>({});
  const rawMarkdownOutput = ref<string>('');
  const metrics = ref<{ latency?: number; tokens?: number } | undefined>(undefined);

  // Agent State
  const selectedAgent = ref<Partial<Agent> | null>(null);
  const promptFormData = ref<PromptSchemaFormData>({
    purpose: '',
    systemPrompt: '',
    promptTemplate: '',
    schemaFields: [],
  });

  // Embedding State
  const selectedEmbedding = ref<Partial<Embedding> | null>(null);
  const embeddingConfigData = ref<EmbeddingFormData>({
    dimensions: 1536,
    candidateTopN: 60,
    kFactor: 60,
    vectorWeight: 0.5,
    bm25Weight: 0.5,
    topK: 10,
    scoreCutoff: '0.0',
  });

  const activeProviderId = computed(() => {
    if (selectedEmbedding.value) {
      return selectedEmbedding.value.providerId ? String(selectedEmbedding.value.providerId) : '';
    }

    if (selectedAgent.value) {
      return selectedAgent.value.providerId ? String(selectedAgent.value.providerId) : '';
    }

    return '';
  });

  const activeModelFamilyId = computed(() => {
    return selectedEmbedding.value?.modelFamilyId || selectedAgent.value?.modelFamilyId || '';
  });

  const modelOptions = computed(() => {
    return providerStore.getModelOptionsByProviderId(activeProviderId.value || null);
  });

  // Synchronize form values whenever currentAgent changes
  watch(
    () => currentAgent?.value,
    (agent) => {
      if (agent) {
        isSyncing.value = true;
        selectedEmbedding.value = null; // Clear active embedding

        selectedAgent.value = {
          id: agent.id || '',
          name: agent.name || '',
          status: agent.status || 'DRAFT',
          providerId: agent.providerId || '',
          modelFamilyId: agent.modelFamilyId || '',
        };

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
        selectedAgent.value = null;
      }
    },
    { immediate: true, deep: true }
  );

  // Synchronize form values whenever currentEmbedding changes
  watch(
    () => currentEmbedding?.value,
    (embedding) => {
      if (embedding) {
        isSyncing.value = true;
        selectedAgent.value = null; // Clear active agent

        selectedEmbedding.value = {
          id: embedding.id || '',
          name: embedding.name || '',
          status: embedding.status || 'DRAFT',
          providerId: embedding.providerId || '',
          modelFamilyId: embedding.modelFamilyId || '',
          parameters: embedding.parameters || {},
        };

        embeddingConfigData.value = {
          dimensions: embedding.parameters?.dimensions || 1536,
          candidateTopN: (embedding.parameters?.candidateTopN as number) || 60,
          kFactor: (embedding.parameters?.kFactor as number) || 60,
          vectorWeight: (embedding.parameters?.vectorWeight as number) || 0.5,
          bm25Weight: (embedding.parameters?.bm25Weight as number) || 0.5,
          topK: (embedding.parameters?.topK as number) || 10,
          scoreCutoff: String(embedding.parameters?.scoreCutoff || '0.0'),
        };

        nextTick(() => {
          isSyncing.value = false;
          isDirty.value = false;
        });
      } else {
        selectedEmbedding.value = null;
      }
    },
    { immediate: true, deep: true }
  );

  // Track unsaved local form edits
  watch(
    [promptFormData, embeddingConfigData],
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

  const handleSelectTarget = (target: Agent | Embedding) => {
    const isEmbeddingTarget = 'parameters' in target;
    const targetType = isEmbeddingTarget ? 'EMBEDDING' : 'AGENT';

    if (isDirty.value) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to switch? Your changes will be lost.'
      );
      if (!confirmLeave) return;
    }

    if (isEmbeddingTarget) {
      const embedding = target as Embedding;
      selectedAgent.value = null;
      selectedEmbedding.value = {
        id: embedding.id || '',
        name: embedding.name || '',
        status: embedding.status || 'DRAFT',
        providerId: embedding.providerId || '',
        modelFamilyId: embedding.modelFamilyId || '',
        parameters: embedding.parameters || {},
      };
    } else {
      const agent = target as Agent;
      selectedEmbedding.value = null;
      selectedAgent.value = {
        id: agent.id || '',
        name: agent.name || '',
        status: agent.status || 'DRAFT',
        providerId: agent.providerId || '',
        modelFamilyId: agent.modelFamilyId || '',
      };
    }

    adapter.onSelectTarget(target.id, targetType);
    isDirty.value = false;
  };

  const handleStatusChange = async (status: EntityStatus) => {
    if (isSyncing.value) return;
    if (selectedAgent.value) selectedAgent.value.status = status;
    if (selectedEmbedding.value) selectedEmbedding.value.status = status;
  };

  const handleProviderChange = (providerId: ID) => {
    if (isSyncing.value) return;
    if (selectedAgent.value) {
      selectedAgent.value.providerId = providerId;
      selectedAgent.value.modelFamilyId = '';
    }
    if (selectedEmbedding.value) {
      selectedEmbedding.value.providerId = providerId;
      selectedEmbedding.value.modelFamilyId = '';
    }
  };

  const handleModelChange = (modelId: ID) => {
    if (isSyncing.value) return;
    if (selectedAgent.value) selectedAgent.value.modelFamilyId = modelId;
    if (selectedEmbedding.value) selectedEmbedding.value.modelFamilyId = modelId;
  };

  const handleSave = async () => {
    if (selectedEmbedding.value && adapter.onSaveEmbedding) {
      const payload: Partial<Embedding> = {
        ...selectedEmbedding.value,
        parameters: {
          dimensions: embeddingConfigData.value.dimensions,
          candidateTopN: embeddingConfigData.value.candidateTopN,
          kFactor: embeddingConfigData.value.kFactor,
          vectorWeight: embeddingConfigData.value.vectorWeight,
          bm25Weight: embeddingConfigData.value.bm25Weight,
          topK: embeddingConfigData.value.topK,
          scoreCutoff: embeddingConfigData.value.scoreCutoff,
        },
      };
      await adapter.onSaveEmbedding(payload);
    } else if (selectedAgent.value && adapter.onSaveAgent) {
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
    }
    isDirty.value = false;
  };

  const handleVariableValuesChange = (values: Record<string, string>) => {
    activeVariableValues.value = values;
  };

  const handleRunTest = async () => {
    if (!adapter.onRunTest) return;

    isExecuting.value = true;
    try {
      const targetPayload = selectedEmbedding.value || selectedAgent.value || {};
      await adapter.onRunTest(targetPayload, activeVariableValues.value);
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
    embeddings,
    selectedAgent,
    selectedEmbedding,
    providerOptions,
    modelOptions,
    promptFormData,
    embeddingConfigData,
    isSchemaValid,
    responseOutput,
    rawMarkdownOutput,
    metrics,

    // Computeds
    activeProviderId,
    activeModelFamilyId,
    parsedVariables,
    hasOutputSchema,

    // Handlers
    handleSelectTarget,
    handleStatusChange,
    handleProviderChange,
    handleModelChange,
    handleSave,
    handleVariableValuesChange,
    handleRunTest,
  };
}
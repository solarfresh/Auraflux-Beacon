<template>
  <VBox tag="main" background="slate-50" class="h-screen overflow-hidden">
    <VGrid cols="12" gap="lg" padding="lg" class="max-w-400 mx-auto h-full">

      <VBox tag="section" class="col-span-8 h-full overflow-y-auto border-r border-slate-200">
        <VBox class="ml-auto w-full">
          <VForm @submit.prevent gap="lg">
            <VFieldset
              title="Persona & Core Logic"
              description="Define the system persona and behavioral constraints based on Kuhlthau ISP."
              padding="lg"
            >
              <VStack gap="md">
                <VFormField
                  label="System Prompt"
                  description="The foundational instructions that dictate agent behavior."
                >
                  <template #default="{ id }">
                    <VTextarea
                      :id="id"
                      v-model="currentAgent.systemPrompt"
                      placeholder="You are an Explorer Agent..."
                      :rows="6"
                      class="font-mono text-sm leading-relaxed"
                    />
                  </template>
                </VFormField>

                <VFormField
                  label="Prompt Template"
                  description="Structured template for dynamic variable injection."
                >
                  <template #default="{ id }">
                    <VTextarea
                      :id="id"
                      v-model="promptTemplate"
                      placeholder="Context: {{context}}..."
                      :rows="16"
                      class="font-mono text-sm"
                    />
                  </template>
                </VFormField>
              </VStack>
            </VFieldset>

            <VFieldset
              title="Output Structure"
              description="Define the mandatory JSON schema for structured responses."
              padding="lg"
            >
              <VFormField label="Response Schema (JSON)">
                <template #default="{ id }">
                  <VTextarea
                    :id="id"
                    v-model="outputSchema"
                    placeholder='{ "type": "object", ... }'
                    :rows="10"
                    class="font-mono text-sm bg-slate-50 border-slate-200"
                  />
                </template>
              </VFormField>
            </VFieldset>
          </VForm>
        </VBox>
      </VBox>

      <VBox tag="aside" class="col-span-4 h-full overflow-y-auto bg-white" padding="lg">
        <VStack gap="lg">
          <VBox padding="sm" rounded="md" background="white" border="all" class="border-slate-200">
            <VCluster justify="between" align="center">
              <VCluster gap="xs" align="center">
                <VBox
                  width="2"
                  height="2"
                  rounded="full"
                  background="emerald-50"
                  :class="[statusConfig.color, statusConfig.animate, 'transition-all duration-500']"
                />
                <VTypography
                  size="xs"
                  color="slate-500"
                  weight="medium"
                  :class="[statusConfig.textColor, 'uppercase tracking-wider']"
                >
                  {{ statusConfig.label }}
                </VTypography>
              </VCluster>
<!--
              <VTypography size="xs" color="slate-300">
                v{{ currentAgent.version || '1.0.0' }}
              </VTypography>
 -->
            </VCluster>
          </VBox>

          <VFieldset title="Intelligence Engine" padding="sm">
            <VStack gap="md">
              <VFormField
                label="Provider"
                description="Choose the infrastructure engine for this agent."
              >
                <VSelect
                  v-model="currentAgent.llmParameters.provider"
                  size="sm"
                >
                  <option disabled value="">Select a provider...</option>
                  <option
                    v-for="p in providers"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.type }})
                  </option>
                </VSelect>
              </VFormField>

              <VFormField
                label="Model Family"
                :description="!currentProviderId ? 'Please select a provider first' : ''"
              >
                <VSelect
                  v-model="currentAgent.llmParameters.model"
                  size="sm"
                  :disabled="!currentProviderId"
                >
                  <option disabled value="">Select a model family...</option>
                  <option
                    v-for="f in currentProvider?.supportedFamilies"
                    :key="f.id"
                    :value="f.name"
                  >
                    {{ f.displayName }}
                  </option>
                </VSelect>
              </VFormField>

              <VFormField label="Temperature">
                <VInput
                  v-model="currentAgent.llmParameters.temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  size="sm"
                />
              </VFormField>
            </VStack>
          </VFieldset>

          <VFieldset title="Identity" padding="md">
            <VStack gap="md">
              <VFormField label="Functional Role">
                <VInput
                  v-model="currentAgent.role"
                  placeholder="e.g. EXPLORER"
                  size="sm"
                  class="font-bold tracking-tight"
                />
              </VFormField>

              <VBox v-if="detectedVariables.length > 0" class="mt-2">
                <VTypography size="xs" weight="bold" color="slate-400" class="uppercase mb-2">
                  Detected Variables
                </VTypography>
                <VCluster gap="xs" :wrap="true">
                  <VBox
                    v-for="v in detectedVariables"
                    :key="v"
                    tag="span"
                    background="slate-50"
                    class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 border border-slate-200"
                  >
                    {{ v }}
                  </VBox>
                </VCluster>
              </VBox>
            </VStack>
          </VFieldset>

        </VStack>
      </VBox>

    </VGrid>
  </VBox>
</template>

<script setup lang="ts">
/**
 * AgentEditorPage Component
 * Layout: Asymmetric 2-column (8:4)
 * Architecture: Form-driven with Fieldset/FormField molecules.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAgentStore } from '@/stores/agent';
import { useRoute } from 'vue-router';

import VBox from '@/components/atoms/layout/VBox.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Molecules
import VForm from '@/components/molecules/forms/VForm.vue';
import VFieldset from '@/components/molecules/forms/VFieldset.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';

// Atoms
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';

import type { ID } from '@/interfaces/core';
import type { Agent, ModelProvider } from '@/interfaces/agents';
import type { ConnectStatus } from '@/interfaces/core';

const route = useRoute();
const agentStore = useAgentStore();

const currentAgentId = computed(()=> route.params.id as ID);
const currentAgent = computed((): Agent  => {
  if (agentStore.currentAgent) return agentStore.currentAgent;
  return {
    id: '',
    name: '',
    role: '',
    systemPrompt: '',
    promptTemplate: '',
    outputSchema: {},
    templateVariables: {},
    llmParameters: {
      provider: '',
      model: 'gemini-3-flash-preview',
      temperature: 0.1
    },
    createdAt: '',
    updatedAt: ''
  }
});
const providers = computed((): ModelProvider[] => [...agentStore.providers.values()]);
const currentProviderId = computed({
  get: () => agentStore.currentProviderId,
  set: (val) => agentStore.setCurrentProviderId(val)
});
const currentProvider = computed(() => agentStore.currentModelProvider);

const promptTemplate = computed({
  get: () => agentStore.currentAgent?.promptTemplate?.replace(/\\n/g, '\n'),
  set: (val) => {
    if (agentStore.currentAgent) {
      agentStore.currentAgent.promptTemplate = val;
    }
  }
});
const outputSchema = computed({
  get: () => JSON.stringify(agentStore.currentAgent?.outputSchema || {}, null, 2),
  set: (val) => {
    if (agentStore.currentAgent) {
      const parsed = JSON.parse(val);
      agentStore.currentAgent.outputSchema = outputSchema;
    }
  }
})

const statusConfig = computed(() => {
  const status = agentStore.connectStatus as ConnectStatus;

  const mapping: Record<ConnectStatus, { color: string; textColor: string; label: string; animate: string }> = {
    IDLE: {
      color: 'bg-slate-300',
      textColor: 'text-slate-500',
      label: 'Synced',
      animate: ''
    },
    ACTIVE: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      label: 'Saving...',
      animate: 'animate-pulse'
    },
    UNVERIFIED: {
      color: 'bg-blue-400',
      textColor: 'text-blue-600',
      label: 'Modified',
      animate: ''
    },
    ERROR: {
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      label: 'Sync Error',
      animate: ''
    },
    RATE_LIMITED: {
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      label: 'Slow Down',
      animate: ''
    }
  };

  return mapping[status] || mapping.IDLE;
});

watch(
  () => agentStore.currentAgent,
  (newVal, oldVal) => {
    if (!oldVal) return;

    agentStore.connectStatus = 'UNVERIFIED';
    if (newVal) {
      agentStore.debouncedUpdateAgent();
    }
  },
  { deep: true }
);

onMounted(async () => {
  agentStore.loadProviders();
  await agentStore.loadAgentDetail(currentAgentId.value);
});

onBeforeUnmount(() => {
  if (typeof agentStore.debouncedUpdateAgent?.flush === 'function') {
    agentStore.debouncedUpdateAgent.flush();
  } else {
    console.warn('debouncedUpdateAgent.flush is not available');
  }
});

/**
 * Regex to detect dynamic variables in the prompts for the sidebar.
 * This provides immediate feedback on what 'template_variables' will be created.
 */
const detectedVariables = computed(() => {
  const systemPrompt = currentAgent.value.systemPrompt || '';
  const promptTemplate = currentAgent.value.promptTemplate || '';

  const combined = systemPrompt + promptTemplate;
  const matches = combined.matchAll(/\{\{(.*?)\}\}/g);
  return [...new Set(Array.from(matches, m => m[1].trim()))];
});
</script>
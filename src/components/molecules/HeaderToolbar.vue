<template>
  <header class="bg-white shadow-md w-full border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

      <div class="flex items-center space-x-4">
        <Icon name="swatch" type="solid" size="xl" color="indigo-600" />
        <Text tag="h1" size="2xl" weight="bold" color="gray-900">
          Strategic Canvas MVP
        </Text>
      </div>

      <div class="hidden md:block">
        <Text tag="span" size="base" weight="medium" color="gray-600">
          Current Step:
        </Text>
        <Text tag="span" size="lg" weight="semibold" color="blue-600" class="ml-1">
          {{ currentStepMap[currentStep] || 'Initializing...' }}
        </Text>
      </div>

      <div class="flex items-center space-x-3">

        <Button
          variant="secondary"
          size="sm"
          @click="$emit('openFlowHistory')"
        >
          <Icon name="clock-history" type="solid" size="sm" color="gray-700" class="mr-1" />
          <Text tag="span" size="sm" weight="medium" color="gray-700">
            Flow History
          </Text>
        </Button>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('exportShortcut')"
          :disabled="currentStep === 'SEARCH'"
        >
          <Icon name="download" type="solid" size="sm" color="blue-500" class="mr-1" />
          <Text tag="span" size="sm" weight="medium" color="blue-500">
            Export Report
          </Text>
        </Button>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';

// --- Type Definitions (Must match the global workflow state) ---
type WorkflowStep = 'SEARCH' | 'SCOPE' | 'COLLECTION' | 'ANALYSIS' | 'OUTPUT';

// --- Props ---
const props = defineProps({
  currentStep: {
    type: String as () => WorkflowStep,
    required: true,
  },
});

const emit = defineEmits(['openFlowHistory', 'exportShortcut']);

// --- Utility Map for Display ---
const currentStepMap: Record<WorkflowStep, string> = {
  SEARCH: '1. Data Lock',
  SCOPE: '2. Define Scope',
  COLLECTION: '3. Opinion Collection',
  ANALYSIS: '4. Tension Analysis',
  OUTPUT: '5. Final Output',
};
</script>
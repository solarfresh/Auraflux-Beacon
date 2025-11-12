<template>
  <div class="space-y-8">

    <div class="p-5 border rounded-xl bg-blue-50">
      <Text tag="h3" size="lg" weight="semibold" color="blue-800" class="mb-4 flex items-center">
        <Icon name="puzzle-piece" type="solid" size="md" color="blue-600" class="mr-2" />
        1. Select Core Strategic Tension (The Dichotomy)
      </Text>

      <Text tag="p" size="sm" color="gray-600" class="mb-4">
        Choose the fundamental conflict your organization is currently facing. This defines the adversarial roles in the analysis.
      </Text>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="dichotomy in availableDichotomies"
          :key="dichotomy.id"
          :class="[
            'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
            selectedDichotomyId === dichotomy.id
              ? 'border-indigo-600 ring-4 ring-indigo-100 bg-white shadow-lg'
              : 'border-gray-200 hover:border-gray-400'
          ]"
          @click="selectedDichotomyId = dichotomy.id"
        >
          <Text tag="h4" size="base" weight="bold" :color="selectedDichotomyId === dichotomy.id ? 'indigo-700' : 'gray-800'">
            {{ dichotomy.name }}
          </Text>
          <Text tag="p" size="xs" color="gray-500" class="mt-1">
            {{ dichotomy.description }}
          </Text>
        </div>
      </div>
    </div>

    <div v-if="selectedDichotomy" class="p-5 border rounded-xl bg-white shadow-inner">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="mb-4 flex items-center">
        <Icon name="users" type="solid" size="md" color="gray-600" class="mr-2" />
        2. Confirm Agents and Define Question
      </Text>

      <div class="mb-5">
        <Text tag="p" size="base" weight="medium" color="gray-700" class="mb-2">
          Conflicting Agents Assigned:
        </Text>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="role in selectedDichotomy.roles"
            :key="role"
            class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <Text tag="label" size="base" weight="medium" color="gray-700" for="focused-question" class="block mb-2">
        Define the single, focused question for the Agents to answer:
      </Text>
      <Textarea
        id="focused-question"
        v-model="focusedQuestion"
        :rows="3"
        placeholder="E.g., Given the Speed vs. Security tension, should we implement mandatory two-factor authentication for all new internal systems?"
        size="md"
      />

      <Text v-if="questionValidation" tag="p" size="sm" color="red-500" class="mt-1">
        {{ questionValidation }}
      </Text>
    </div>

    <div class="flex justify-center p-4">
      <Button
        variant="primary"
        size="lg"
        :disabled="!isFormValid"
        @click="finalizeScope"
      >
        <Icon name="arrow-right" type="solid" size="md" color="white" class="mr-2" />
        Run Opinion Collection (Step 3)
      </Button>
    </div>

  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { Dichotomy } from '@/interfaces/search';
import { computed, ref } from 'vue';

// --- Component State ---
const selectedDichotomyId = ref<string | null>(null);
const focusedQuestion = ref<string>('');

// --- Static Data (To be fetched from an API in a real app) ---
const availableDichotomies: Dichotomy[] = [
  {
    id: 'speed_security',
    name: 'Speed vs. Security',
    description: 'Balancing rapid deployment/iteration with robust defense and compliance.',
    roles: ['CTO (Speed Focus)', 'Legal/Ethics Agent (Security Focus)', 'Strategy Analyst'],
  },
  {
    id: 'innovation_regulation',
    name: 'Innovation vs. Regulation',
    description: 'Pushing boundaries with new tech versus maintaining strict adherence to rules.',
    roles: ['Head of R&D', 'Chief Compliance Officer', 'Finance Director'],
  },
  {
    id: 'centralization_autonomy',
    name: 'Centralization vs. Autonomy',
    description: 'Managing control/efficiency from HQ versus empowering local team decision-making.',
    roles: ['COO', 'Regional Manager', 'HR Lead'],
  },
];

// --- Computed Properties ---

const selectedDichotomy = computed(() => {
  return availableDichotomies.find(d => d.id === selectedDichotomyId.value) || null;
});

const questionValidation = computed(() => {
  if (!focusedQuestion.value.trim()) {
    return 'The focused question is mandatory to run the analysis.';
  }
  if (focusedQuestion.value.length < 20) {
    return 'Please provide a more detailed question (minimum 20 characters).';
  }
  return null;
});

const isFormValid = computed(() => {
  return selectedDichotomy.value !== null && questionValidation.value === null;
});

// --- Methods and Actions ---
const emit = defineEmits(['scopeDefined']);

const finalizeScope = () => {
  if (!isFormValid.value || !selectedDichotomy.value) return;

  const scopeData = {
    dichotomy: selectedDichotomy.value.name,
    roles: selectedDichotomy.value.roles,
    question: focusedQuestion.value.trim(),
  };

  // Emit the finalized scope data up to the parent component (StrategyCanvasTemplate)
  emit('scopeDefined', scopeData);

  // The parent component should then update the global state to 'COLLECTION'
  console.log('Scope Finalized:', scopeData);
};
</script>
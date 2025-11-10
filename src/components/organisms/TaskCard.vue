<template>
  <div
    :class="[
      'rounded-xl border shadow-lg transition-all duration-300 ease-in-out',
      baseStyle,
      statusStyles[status]
    ]"
    :aria-disabled="isDisabled"
  >
    <div
      :class="[
        'flex items-center justify-between p-6 cursor-pointer rounded-t-xl transition-colors duration-200',
        headerStyles[status]
      ]"
      @click="handleToggle"
    >
      <div class="flex items-center space-x-4">
        <Icon
          :name="iconName"
          type="solid"
          size="lg"
          :color="iconColor"
        />

        <Text tag="h2" size="xl" :weight="status === 'ACTIVE' ? 'bold' : 'medium'" :color="titleColor">
          {{ title }}
        </Text>

        <Text v-if="!isActive && isComplete" tag="span" size="base" color="gray-500" class="ml-4">
          {{ completionSummary }}
        </Text>
      </div>

      <Icon
        v-if="!isDisabled"
        :name="isActive ? 'chevron-up' : 'chevron-down'"
        type="solid"
        size="md"
        color="gray-500"
        class="transition-transform"
      />
    </div>

    <div v-if="isActive" class="p-6 pt-4 border-t border-gray-200 bg-white rounded-b-xl">
      <slot></slot>

      <div v-if="showActionButton" class="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="md"
          @click="$emit('stepComplete', stepId)"
        >
          {{ actionButtonText }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue'; // Assuming Button is available
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { CardStatus, WorkflowStep } from '@/interfaces/search';
import { computed } from 'vue';

// --- Props ---
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  stepId: {
    type: String as () => WorkflowStep,
    required: true,
  },
  currentStep: {
    type: String as () => WorkflowStep,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  completionSummary: {
    type: String,
    default: 'Setup complete.',
  },
  showActionButton: {
    type: Boolean,
    default: false,
  },
  actionButtonText: {
    type: String,
    default: 'Continue to Next Step',
  }
});

const emit = defineEmits(['stepComplete', 'cardToggle']);

// --- Computed Status Logic ---

// Determines the explicit visual status of the card
const status = computed<CardStatus>(() => {
  if (props.currentStep === props.stepId) {
    return 'ACTIVE';
  }
  if (props.isComplete) {
    return 'COMPLETE';
  }
  return 'DISABLED';
});

// Controls whether the body content is visible
const isActive = computed(() => status.value === 'ACTIVE');

// Controls whether interaction is blocked
const isDisabled = computed(() => status.value === 'DISABLED');


// --- Computed Styles (Tailwind CSS) ---

const baseStyle = 'bg-white'; // Base background for the card container

// Styles based on the computed status
const statusStyles = {
  ACTIVE: 'border-blue-500 shadow-xl ring-2 ring-blue-100', // Highlight active card
  COMPLETE: 'border-green-300 shadow-md', // Subtle success indicator
  DISABLED: 'border-gray-200 opacity-60 pointer-events-none', // Visually block disabled cards
};

// Header background and hover effects
const headerStyles = {
  ACTIVE: 'bg-blue-50 hover:bg-blue-100',
  COMPLETE: 'bg-green-50 hover:bg-green-100',
  DISABLED: 'bg-gray-100 cursor-default',
};

// Icon properties
const iconName = computed(() => {
  if (status.value === 'COMPLETE') return 'check-circle';
  if (status.value === 'ACTIVE') return 'arrow-right-circle';
  return 'lock-closed';
});

const iconColor = computed(() => {
  if (status.value === 'COMPLETE') return 'text-green-600';
  if (status.value === 'ACTIVE') return 'text-blue-600';
  return 'text-gray-400';
});

const titleColor = computed(() => {
  if (status.value === 'DISABLED') return 'text-gray-500';
  return 'text-gray-800';
});

// --- Methods ---

const handleToggle = () => {
  // Only allow collapse/expand if the card is COMPLETE (for review) or ACTIVE
  if (!isDisabled.value) {
    // In the final application, we would handle explicit toggling here.
    // However, in this strict linear MVP, we only allow toggle for review
    // if the card is complete, or if it is the current active step.
    emit('cardToggle', props.stepId);
  }
};
</script>
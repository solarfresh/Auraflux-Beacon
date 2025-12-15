<template>
  <div class="p-4 bg-white border-t border-indigo-200 flex justify-end items-center shadow-lg">

    <Button
      @click="handlePhaseTransition"
      :disabled="isTransitioning || !isProceedReady"
      variant="primary"
      class="px-8 py-3 font-bold text-base shadow-xl transition-all duration-300"
      :class="{
        // High contrast styling for ready state
        'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500': isProceedReady,
        // Disabled state styling
        'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70': !isProceedReady
      }"
    >
      <Text tag="span" size="base" weight="bold" color="current">
        {{ isTransitioning ? 'Finalizing Data...' : '✅ Lock & Proceed to Exploration Phase' }}
      </Text>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Text from '@/components/atoms/Text.vue';
import { ref } from 'vue';
import { useWorkflowAuth } from '@/composables/useWorkflowAuth';

// --- Props ---
const props = defineProps<{
  /**
   * General flag indicating if all flow gates (Question LOCKED, minimum Keywords) are met.
   * Calculated and passed down by the parent component (InitiationPage).
   */
  isProceedReady: boolean;
}>();

// --- Events ---
const emit = defineEmits<{
  /**
   * Emitted to request the parent component to handle the sequential actions:
   * 1. Data Finalization (Locking entities)
   * 2. Phase Transition (Updating workflow state)
   * 3. Page Navigation (Routing to /exploration)
   */
  (e: 'transitionRequest'): void;
}>();

// --- Initialization ---
const { executeAuthAction } = useWorkflowAuth();
// Local state to manage the button's loading/processing state
const isTransitioning = ref(false);

// --- Handlers ---

/**
 * Handles the combined action of locking the data and requesting phase transition.
 * Requires authentication and satisfied readiness checks.
 */
const handlePhaseTransition = () => {
    // Prevent execution if already processing or if readiness check fails
    if (isTransitioning.value || !props.isProceedReady) return;

    // 1. Auth Check (Ensures user is logged in)
    executeAuthAction(() => {
        // 2. If Auth passes, lock the button and request transition
        isTransitioning.value = true;

        // Emit single event for parent to handle sequential store actions
        emit('transitionRequest');

        // NOTE: isTransitioning is reset by the parent component (InitiationPage)
        // once the API calls and navigation are complete or have failed.
    });
};
</script>
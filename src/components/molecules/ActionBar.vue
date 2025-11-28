<template>
  <div class="p-4 bg-white border-t flex justify-between items-center shadow-inner">

    <button
      @click="handleReflectStart"
      class="flex items-center text-sm text-gray-600 hover:text-gray-900 transition duration-150 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Log a thought or feeling for reflection."
    >
      <Icon name="LightBulb" type="outline" size="sm" color="gray-500" class="mr-2" />
      <Text tag="span" size="sm" weight="medium" color="gray-700">
        I'm thinking... (Reflector Agent)
      </Text>
    </button>

    <Button
      @click="handlePhaseTransition"
      :disabled="!finalQuestion || isTransitioning"
      variant="primary"
      class="px-6 py-2"
      :class="[
        !finalQuestion ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' : ''
      ]"
    >
      <Text tag="span" size="sm" weight="semibold" color="current">
        {{ isTransitioning ? 'Processing...' : '✅ Lock & Proceed to Selection Phase' }}
      </Text>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import { ref } from 'vue';
import { useWorkflowAuth } from '@/composables/useWorkflowAuth'; // Import Auth Composable

// --- Props ---
const props = defineProps<{
  /**
   * The final synthesized research question string.
   * Required to enable the transition button (Flow Gate).
   */
  finalQuestion: string;
}>();

// --- Events ---
const emit = defineEmits<{
  /**
   * Emitted when the user clicks the reflection start button.
   */
  (e: 'reflectStart'): void;

  /**
   * Emitted to request the parent component to handle both
   * data finalization (lock) and phase transition.
   */
  (e: 'transitionRequest'): void;
}>();

// --- Initialization ---
const { executeAuthAction } = useWorkflowAuth();
const isTransitioning = ref(false); // Local state to prevent rapid double-clicking

// --- Handlers: Encapsulate actions with authentication check ---

/**
 * Handles starting the reflection process, requiring authentication.
 */
const handleReflectStart = () => {
    executeAuthAction(() => {
        emit('reflectStart');
    });
};

/**
 * Handles the combined action of locking the data and requesting phase transition.
 * Requires authentication and a finalized question.
 */
const handlePhaseTransition = () => {
    // Prevent execution if already processing or if the question is missing
    if (isTransitioning.value || !props.finalQuestion) return;

    // 1. Auth Check (Ensures user is logged in)
    executeAuthAction(() => {
        // 2. If Auth passes, lock the button and request transition
        isTransitioning.value = true;

        // Emit single event for parent to handle sequential store actions (Lock Data -> Change Phase)
        emit('transitionRequest');

        // NOTE: isTransitioning should be reset by the parent component or by
        // watching a global loading state (e.g., workflowStore.isLoading).
        // For simplicity here, the parent will handle the loading state.
    });
};
</script>
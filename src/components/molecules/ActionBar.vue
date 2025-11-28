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
      :disabled="!isQuestionFinalized"
      variant="primary"
      class="px-6 py-2"
      :class="[
        !isQuestionFinalized ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' : ''
      ]"
    >
      <Text tag="span" size="sm" weight="semibold" color="current">
        ✅ Proceed to Selection Phase
      </Text>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import { useWorkflowAuth } from '@/composables/useWorkflowAuth'; // Import Auth Composable

// --- Props ---
const props = defineProps<{
  /**
   * Flag indicating whether the final research question has been structured and finalized.
   * Controls the enable/disable state of the phase transition button.
   */
  isQuestionFinalized: boolean;
}>();

// --- Events ---
const emit = defineEmits<{
  /**
   * Emitted when the user clicks the "I'm thinking..." button to start reflection.
   */
  (e: 'reflectStart'): void;

  /**
   * Emitted when the user clicks the "Proceed to Selection Phase" button (if enabled).
   */
  (e: 'phaseTransition'): void;
}>();

// --- Initialization ---
const { executeAuthAction } = useWorkflowAuth(); // Initialize the Composable

// --- Handlers: Encapsulate actions with authentication check ---

/**
 * Handles starting the reflection process, requiring authentication.
 */
const handleReflectStart = () => {
    // Ensure the user is logged in before allowing the reflection process to start.
    executeAuthAction(() => {
        emit('reflectStart');
    });
};

/**
 * Handles transitioning to the next ISP phase, requiring authentication and finalization.
 */
const handlePhaseTransition = () => {
    // Ensure the user is logged in before attempting to transition.
    executeAuthAction(() => {
        // Only allow transition if the login check passed AND the question is finalized.
        if (props.isQuestionFinalized) {
            emit('phaseTransition');
        }
    });
};
</script>
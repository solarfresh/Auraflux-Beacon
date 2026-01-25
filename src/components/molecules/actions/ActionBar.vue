<template>
  <div class="p-4 bg-white border-t border-indigo-200 flex justify-end items-center shadow-lg">
    <Button
      variant="primary"
      size="lg"
      class="px-8 py-3 shadow-xl transition-all duration-300"
      :disabled="isTransitioning || !isProceedReady"
      @click="handlePhaseTransition"
    >
      <div class="flex items-center space-x-2">
        <Text tag="span" weight="bold">
          {{ isTransitioning ? 'Finalizing Data...' : 'Lock & Proceed to Exploration Phase' }}
        </Text>
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/atoms/actions/Button.vue';
import Text from '@/components/atoms/Text.vue';
import { useWorkflowAuth } from '@/composables/useWorkflowAuth';

/**
 * ActionBar Molecule
 * Positioned usually at the bottom of the page to handle critical phase transitions.
 */
const props = defineProps<{
  /** Indicates if business logic requirements for the next phase are met */
  isProceedReady: boolean;
}>();

const emit = defineEmits<{
  /** Requests the parent to handle the API and navigation sequence */
  (e: 'transitionRequest'): void;
}>();

const { executeAuthAction } = useWorkflowAuth();
const isTransitioning = ref(false);

const handlePhaseTransition = () => {
  if (isTransitioning.value || !props.isProceedReady) return;

  executeAuthAction(() => {
    isTransitioning.value = true;
    emit('transitionRequest');

    // Safety timeout: reset loading if no response after 10s
    // (Optional: handle this via parent or a shared state)
  });
};

/**
 * Resetting transition state can be exposed to parent via defineExpose if needed
 */
defineExpose({
  stopTransition: () => isTransitioning.value = false
});
</script>
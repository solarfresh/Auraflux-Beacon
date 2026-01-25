<template>
  <!--
    The VModal component handles the backdrop, z-index, accessibility,
    and the Esc key/scroll lock logic.
  -->
  <VModal :is-open="isOpen" :max-width-class="maxWidthClass" @close="$emit('close')">
    <div
      class="relative w-full bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
      @click.stop
    >
      <!-- Modal Header -->
      <header class="flex justify-between items-center p-4 border-b">

        <!-- Replaced <h3> with Text component for consistent styling -->
        <VTypography tag="h3" id="modal-title" size="xl" weight="semibold" color="gray-800">
          <!-- Default slot for custom header title -->
          <slot name="header">
            Auxiliary Panel
          </slot>
        </VTypography>

        <!-- Close Button Molecule -->
        <VCloseButton @click="$emit('close')" aria-label="Close auxiliary panel" />
      </header>

      <!-- Modal Body Content -->
      <main class="p-6 overflow-y-auto flex-1">
        <slot name="content" />
      </main>
    </div>
  </VModal>
</template>

<script setup lang="ts">
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VModal from '@/components/molecules/navs/VModal.vue';
import VCloseButton from '@/components/atoms/buttons/VCloseButton.vue';

// Define the component's props and events
const props = defineProps<{
  /**
   * The visibility state of the modal, passed down to VModal.vue.
   */
  isOpen: boolean;
  maxWidthClass?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped>
/* No specific styles needed here */
</style>
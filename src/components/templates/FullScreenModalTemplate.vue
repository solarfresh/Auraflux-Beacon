<template>
  <!--
    The Modal component handles the backdrop, z-index, accessibility,
    and the Esc key/scroll lock logic.
  -->
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <div
      class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] mx-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <header class="flex justify-between items-center p-4 border-b">

        <!-- Replaced <h3> with Text component for consistent styling -->
        <Text tag="h3" id="modal-title" size="xl" weight="semibold" color="gray-800">
          <!-- Default slot for custom header title -->
          <slot name="header">
            Auxiliary Panel
          </slot>
        </Text>

        <!-- Close Button Molecule -->
        <CloseButton @click="$emit('close')" aria-label="Close auxiliary panel" />
      </header>

      <!-- Modal Body Content -->
      <main class="p-6 overflow-y-auto flex-1">
        <slot name="content">
          <!-- Default slot for main content (e.g., ReflectionModal) -->
          <slot />
        </slot>
      </main>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import Modal from '@/components/molecules/Modal.vue';
import CloseButton from '../molecules/CloseButton.vue'; // Import the new Molecule

// Define the component's props and events
defineProps<{
  /**
   * The visibility state of the modal, passed down to Modal.vue.
   */
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped>
/* No specific styles needed here */
</style>
<template>
  <!--
    The Modal component handles the backdrop, z-index, accessibility,
    and the Esc key/scroll lock logic.
  -->
  <Modal :is-open="isOpen" :max-width-class="maxWidthClass" @close="$emit('close')">
    <div
      class="relative w-full bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
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
        <slot name="content" />
      </main>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import Modal from '@/components/molecules/overlays/Modal.vue';
import CloseButton from '@/components/molecules/overlays/CloseButton.vue';

// Define the component's props and events
const props = defineProps<{
  /**
   * The visibility state of the modal, passed down to Modal.vue.
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
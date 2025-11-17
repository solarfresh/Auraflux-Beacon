<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50"
      @click.self="$emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-lg w-full m-4 transform"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  /**
   * Controls the visibility of the modal.
   */
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close'): void
}>();

// --- Accessibility/UX Logic ---

/**
 * Handles the logic for closing the modal when the Escape key is pressed.
 */
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

// Watch for changes to 'isOpen' to handle key events and body scrolling
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // 1. Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';

    // 2. Add key listener for Esc key to close the modal
    document.addEventListener('keydown', handleEscapeKey);
  } else {
    // 1. Re-enable scrolling when modal is closed
    document.body.style.overflow = '';

    // 2. Remove the key listener
    document.removeEventListener('keydown', handleEscapeKey);
  }
}, { immediate: true });
</script>

<style scoped>
/* * --- Vue Transition Styles (CSS keyframes equivalent for class names) ---
 * Note: These are standard Vue transition classes applied to the <Transition> component.
 */

/* 1. Backdrop Opacity Transition */

/* State when transition starts (before-enter, after-leave) */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* During transition (entering/leaving) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  /* Use a longer duration for smooth opacity changes */
  transition: opacity 0.3s ease-in-out;
}

/* 2. Modal Content (Inner Transform/Scale) Transition */
/* We target the inner <div> with the 'transform' class to apply scaling */

/* Entry: starts small, ends at full size */
.modal-fade-enter-from .transform {
  transform: scale(0.95);
}

/* Exit: shrinks as it leaves */
.modal-fade-leave-to .transform {
  transform: scale(0.95);
}

/* Apply the transform transition duration */
.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
  transition: transform 0.3s ease-in-out;
}
</style>
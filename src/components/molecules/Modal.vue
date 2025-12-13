<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-gray-900/50"
      @click.self="$emit('close')"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        :class="['mx-auto my-4 transform', modalWidthClass]"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';

// --- Props & Emits ---
const props = defineProps({
  /**
   * Controls the visibility of the modal.
   */
  isOpen: {
    type: Boolean,
    required: true,
  },
  maxWidthClass: {
    type: String,
    required: false
  }
});

const emit = defineEmits<{
  (e: 'close'): void
}>();

const modalWidthClass = computed(() => props.maxWidthClass || 'max-w-2xl');

// --- Accessibility/UX Logic ---

/**
 * Handles the logic for closing the modal when the Escape key is pressed.
 */
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

// SIMPLIFICATION: Manage scrolling via watch, but manage the global key listener using onMounted/onUnmounted.

// Manage body scrolling only (The core reason for the watch)
watch(() => props.isOpen, (newVal) => {
  // Prevent/re-enable scrolling on the body
  document.body.style.overflow = newVal ? 'hidden' : '';
}, { immediate: true });

// Attach/Detach the key listener only when the component is mounted/unmounted.
// Since the key listener uses 'emit("close")', it will rely on the watch above to handle the cleanup.
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  // Important: Ensure scrolling is restored if component is destroyed while open
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* * --- Vue Transition Styles (CSS keyframes equivalent for class names) --- */

/* 1. Backdrop Opacity Transition */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

/* 2. Modal Content (Inner Transform/Scale) Transition */
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
<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <VBox
        intent="neutral"
        surface="soft"
        rounded="xl"
        border="none"
        :class="[
          'shadow-2xl transform transition-all overflow-hidden flex flex-col',
          sizeStyles
        ]"
      >
        <!-- Modal Header -->
        <VBox
          v-if="$slots.header || title"
          tag="header"
          intent="brand"
          surface="solid"
          padding="md"
          border="none"
          class="flex items-center justify-between"
        >
          <slot name="header">
            <VTypography tag="h3" size="lg" weight="bold">
              {{ title }}
            </VTypography>
          </slot>

          <VButton
            attention="primary"
            iconOnly
            iconName="XMark"
            size="sm"
            @click="$emit('close')"
            aria-label="Close modal"
          />
        </VBox>

        <!-- Modal Body -->
        <VBox padding="md" class="overflow-y-auto flex-1">
          <slot></slot>
        </VBox>

        <!-- Modal Footer -->
        <VBox
          v-if="$slots.footer"
          tag="footer"
          intent="neutral"
          surface="outline"
          padding="md"
          border="top"
          class="flex justify-end space-x-3"
        >
          <slot name="footer"></slot>
        </VBox>
      </VBox>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import { SHARED_CONTAINER_SIZE_CLASSES } from '@auraflux/design-system/constants/theme';
import type { ContainerSizeToken } from '@auraflux/design-system/interfaces/theme';

const props = withDefaults(defineProps<{
  /** Controls modal visibility */
  isOpen: boolean;
  /** Modal header title */
  title?: string;
  /** Container width preset token */
  size?: ContainerSizeToken;
}>(), {
  title: '',
  size: 'md'
});

const emit = defineEmits<{ (e: 'close'): void }>();

/** Resolves container sizing classes based on design tokens */
const sizeStyles = computed(() => {
  return SHARED_CONTAINER_SIZE_CLASSES[props.size] || SHARED_CONTAINER_SIZE_CLASSES.md;
});

// --- Accessibility & UX Handlers ---

/** Emits close event on Escape key press */
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

// Lock body scrolling when modal is open
watch(() => props.isOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
}, { immediate: true });

onMounted(() => document.addEventListener('keydown', handleEscapeKey));
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Modal transition animations */
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from .transform { transform: scale(0.95); opacity: 0; }
.modal-fade-enter-active .transform { transition: all 0.3s ease-out; }
</style>
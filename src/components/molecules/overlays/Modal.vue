<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('close')"
    >
      <div
        :class="[
          'bg-white rounded-xl shadow-2xl transform transition-all overflow-hidden flex flex-col',
          sizeClasses
        ]"
      >
        <header v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <slot name="header">
            <Text tag="h3" size="lg" weight="bold" class="text-gray-900">
              {{ title }}
            </Text>
          </slot>

          <Button
            variant="ghost"
            iconOnly
            iconName="XMark"
            size="sm"
            @click="$emit('close')"
            aria-label="Close modal"
          />
        </header>

        <div class="px-6 py-4 overflow-y-auto flex-1">
          <slot></slot>
        </div>

        <footer v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Button from '@/components/atoms/actions/Button.vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '' },
  /** Supported sizes: 'sm' (384px), 'md' (672px), 'lg' (896px), 'full' */
  size: {
    type: String,
    default: 'md',
    validator: (v: string) => ['sm', 'md', 'lg', 'full'].includes(v)
  }
});

const emit = defineEmits<{ (e: 'close'): void }>();

const sizeClasses = computed(() => {
  const mapping: Record<string, string> = {
    sm: 'max-w-md w-full',
    md: 'max-w-2xl w-full',
    lg: 'max-w-4xl w-full',
    full: 'max-w-[95vw] w-full h-[90vh]'
  };
  return mapping[props.size];
});

// --- Accessibility/UX Logic (Same as your original) ---
const handleEscapeKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close'); };

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
/* Same transitions as your original file */
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from .transform { transform: scale(0.95); opacity: 0; }
.modal-fade-enter-active .transform { transition: all 0.3s ease-out; }
</style>
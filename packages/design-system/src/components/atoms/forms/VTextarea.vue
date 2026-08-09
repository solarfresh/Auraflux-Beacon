<template>
  <textarea
    :id="id"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      // Base Form Control Styles
      'block w-full transition duration-150 ease-in-out outline-none border',

      // Shape & Size
      roundedStyles,
      sizeStyles.control,

      // Surface Mapping (Dynamic Intent/Surface resolution)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      surfaceStyle.hover,

      // Dynamic Interactive Focus Ring
      surfaceStyle.focus,

      // Textarea Resize Control
      resizeClasses,

      // Disabled State Override
      disabled ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed pointer-events-none' : ''
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  ></textarea>
</template>

<script setup lang="ts">
/**
 * Textarea Atom
 * Multi-line text input component integrated with Attention/Intent/Surface architecture.
 * Aligned with VInput.vue for design system consistency.
 */
import { computed } from 'vue';
import type {
  RoundedToken,
  ComponentSizeToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_ROUNDED_CLASSES,
  SHARED_COMPONENT_SIZE_CLASSES
} from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VTextareaProps {
  /** HTML textarea id for label association */
  id?: string;
  modelValue?: string;
  placeholder?: string;
  /** Number of visible text lines */
  rows?: number | string;
  /** Visual priority hierarchy token */
  attention?: AttentionToken;
  /** Explicit semantic intent token (e.g. 'danger' for error state) */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
  size?: ComponentSizeToken;
  rounded?: RoundedToken;
  disabled?: boolean;
  /** Controls textarea resizability */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const props = withDefaults(defineProps<VTextareaProps>(), {
  id: undefined,
  modelValue: '',
  rows: 3,
  attention: 'secondary',
  size: 'md',
  rounded: 'md',
  disabled: false,
  resize: 'vertical',
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const roundedStyles = computed(() => {
  return SHARED_ROUNDED_CLASSES[props.rounded] || SHARED_ROUNDED_CLASSES.md;
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.md;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});

const resizeClasses = computed(() => {
  const map: Record<string, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };
  return map[props.resize] || 'resize-y';
});
</script>
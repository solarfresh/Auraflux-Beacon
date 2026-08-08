<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
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

      // Disabled State Override
      disabled ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed pointer-events-none' : ''
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
/**
 * Input Atom
 * Form input component integrated with Attention/Intent/Surface architecture.
 * Manages form state, validation color intent (e.g., danger for errors), and standard sizes.
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

export interface VInputProps {
  /** HTML input id for label association */
  id?: string;
  modelValue?: string | number;
  placeholder?: string;
  type?: string;
  /** Visual priority hierarchy token */
  attention?: AttentionToken;
  /** Explicit semantic intent token (e.g. 'danger' for error state) */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
  size?: ComponentSizeToken;
  rounded?: RoundedToken;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VInputProps>(), {
  id: undefined,
  modelValue: '',
  type: 'text',
  attention: 'secondary',
  size: 'md',
  rounded: 'md',
  disabled: false,
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
</script>
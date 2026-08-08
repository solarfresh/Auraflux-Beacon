<template>
  <select
    :id="id"
    :value="modelValue"
    :disabled="disabled"
    :class="[
      // Base Form Control Styles
      'block w-full transition duration-150 ease-in-out outline-none border cursor-pointer',

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
    @change="handleChange"
  >
    <slot />
  </select>
</template>

<script setup lang="ts" generic="T = any">
/**
 * Select Atom
 * Form select component integrated with Attention/Intent/Surface architecture.
 * Supports generic value binding for modelValue.
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

export interface VSelectProps<TValue = any> {
  /** HTML select id for label association */
  id?: string;
  /** Currently selected value (supports generic types) */
  modelValue?: TValue;
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

const props = withDefaults(defineProps<VSelectProps<T>>(), {
  id: undefined,
  modelValue: undefined,
  attention: 'secondary',
  size: 'md',
  rounded: 'md',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
  (e: 'change', value: T): void;
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

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value as unknown as T;
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<style scoped>
/* Standard select styling for custom dropdown indicator across browsers */
select {
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
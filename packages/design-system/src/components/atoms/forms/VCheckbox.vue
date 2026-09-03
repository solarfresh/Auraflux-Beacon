<template>
  <input
    :id="id"
    type="checkbox"
    :checked="modelValue"
    :disabled="disabled"
    :class="checkboxClasses"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  AttentionToken,
  ComponentSizeToken,
  IntentToken,
  RoundedToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_ROUNDED_CLASSES,
  SHARED_COMPONENT_SIZE_CLASSES
} from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VCheckboxProps {
  /** HTML input id for label association */
  id?: string;
  /** Used for v-model binding. Represents the checked state */
  modelValue?: boolean;
  /** Visual priority hierarchy token */
  attention?: AttentionToken;
  /** Explicit semantic intent token (e.g. 'danger' for error state) */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
  /** Density size variant mapped to system icon dimensions */
  size?: ComponentSizeToken;
  /** Rounded corner style */
  rounded?: RoundedToken;
  /** Disable interactive state */
  disabled?: boolean;
}

const props = withDefaults(defineProps<VCheckboxProps>(), {
  id: undefined,
  modelValue: false,
  attention: 'secondary',
  size: 'sm',
  rounded: 'sm',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const roundedStyles = computed(() => {
  return SHARED_ROUNDED_CLASSES[props.rounded] || SHARED_ROUNDED_CLASSES.sm;
});

const sizeStyles = computed(() => {
  return (
    SHARED_COMPONENT_SIZE_CLASSES[props.size]?.icon ||
    SHARED_COMPONENT_SIZE_CLASSES.sm.icon
  );
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});

const checkboxClasses = computed(() => [
  'transition duration-150 ease-in-out outline-none border cursor-pointer accent-slate-900',
  sizeStyles.value,
  roundedStyles.value,
  surfaceStyle.value.bg,
  surfaceStyle.value.text,
  surfaceStyle.value.border,
  surfaceStyle.value.focus,
  props.disabled
    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed pointer-events-none'
    : '',
]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
};
</script>
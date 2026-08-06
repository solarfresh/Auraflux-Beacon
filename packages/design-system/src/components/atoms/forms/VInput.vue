<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'block w-full transition duration-150 ease-in-out outline-none border',
      roundedStyles,
      sizeStyles.control,
      variantStyles.bg,
      variantStyles.text,
      variantStyles.border || 'border-slate-300',
      variantStyles.hover ? variantStyles.hover : '',
      'focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600',
      disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''
    ]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VariantToken, RoundedToken, SizeToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_ROUNDED_CLASS, SHARED_SIZE_CLASSES, SHARED_VARIANT_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VInputProps {
  /** HTML input id for label association */
  id?: string;
  modelValue?: string | number;
  placeholder?: string;
  type?: string;
  variant?: VariantToken;
  size?: SizeToken;
  rounded?: RoundedToken;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VInputProps>(), {
  id: undefined,
  modelValue: '',
  type: 'text',
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  disabled: false,
});

defineEmits(['update:modelValue']);

const roundedStyles = computed(() => {
  return SHARED_ROUNDED_CLASS[props.rounded] || SHARED_ROUNDED_CLASS.md;
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const variantStyles = computed(() => {
  return SHARED_VARIANT_CLASSES[props.variant] || SHARED_VARIANT_CLASSES.primary;
});
</script>
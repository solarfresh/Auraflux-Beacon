<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full transition-colors',
      variantStyles.bg,
      variantStyles.text,
      variantStyles.border || '',
      sizeStyles.badge
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentVariant, ComponentSize } from '@auraflux/design-system/interfaces/theme';
import { SHARED_SIZE_CLASSES, SHARED_VARIANT_CLASSES } from '@auraflux/design-system/constants/theme';

/**
 * Props for Badge atom
 * @property {string} variant - The color theme of the badge
 * @property {string} size - The physical scale of the badge
 */

export interface VBadgeProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
}

const props = withDefaults(defineProps<VBadgeProps>(), {
  variant: 'primary',
  size: 'sm'
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const variantStyles = computed(() => {
  return SHARED_VARIANT_CLASSES[props.variant] || SHARED_VARIANT_CLASSES.primary;
});

</script>
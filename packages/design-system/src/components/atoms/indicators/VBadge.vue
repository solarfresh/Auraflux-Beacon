<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full transition-colors',
      themeStyles.bg,
      themeStyles.text,
      themeStyles.border || '',
      sizeStyles.badge
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ThemeToken, SizeToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_SIZE_CLASSES, SHARED_THEME_CLASSES } from '@auraflux/design-system/constants/theme';

/**
 * Props for Badge atom
 * @property {string} theme - The color theme of the badge
 * @property {string} size - The physical scale of the badge
 */

export interface VBadgeProps {
  theme?: ThemeToken;
  size?: SizeToken;
}

const props = withDefaults(defineProps<VBadgeProps>(), {
  theme: 'info',
  size: 'sm'
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const themeStyles = computed(() => {
  return SHARED_THEME_CLASSES[props.theme] || SHARED_THEME_CLASSES.info;
});

</script>
<template>
  <component :is="tag" :class="[
    fontWeightStyles,
    sizeStyles.text,
    themeStyles.bg,
    themeStyles.text
  ]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FontWeightToken, SizeToken, TagToken, ThemeToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_FONT_WEIGHT_CLASSES, SHARED_SIZE_CLASSES, SHARED_THEME_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VTypographyProps {
  tag?: TagToken;
  size?: SizeToken;
  weight?: FontWeightToken;
  theme?: ThemeToken;
}

const props = withDefaults(defineProps<VTypographyProps>(), {
  tag: 'p',
  size: 'md',
  weight: 'normal',
  theme: 'outline',
});


const fontWeightStyles = computed(() => {
  return SHARED_FONT_WEIGHT_CLASSES[props.weight] || SHARED_FONT_WEIGHT_CLASSES.normal;
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const themeStyles = computed(() => {
  return SHARED_THEME_CLASSES[props.theme] || SHARED_THEME_CLASSES.outline;
});
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind handles most of the styling. */
</style>
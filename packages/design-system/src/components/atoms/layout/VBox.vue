<template>
  <component
    :is="tag"
    :class="[
      // Spacing
      paddingStyles,

      // Shape & Border
      roundedStyles,
      borderStyles,
      surfaceStyles.bg,
      surfaceStyles.text,
      surfaceStyles.border || '',

      // Interaction logic
      interactionStyles,
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Box Atom (The "Skin" layer)
 * A foundational container that manages padding, borders, and backgrounds.
 * It strictly adheres to Design Tokens to prevent "Magic Values".
 */
import { computed } from 'vue';
import type {SpacingToken, RoundedToken, BorderToken, VariantToken, SurfaceToken} from '@auraflux/design-system/interfaces/theme';
import { SHARED_BORDER_CLASSES, SHARED_PADDING_CLASS, SHARED_ROUNDED_CLASS, SHARED_SURFACE_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VBoxProps {
  /** HTML tag to render */
  tag?: string;
  /** Internal spacing token */
  padding?: SpacingToken;
  /** Radius token. If true, uses 'md' (8px) as default */
  rounded?: RoundedToken;
  /** Border position token */
  border?: BorderToken;
  surface?: SurfaceToken;
  /** Adds pointer cursor and active state */
  clickable?: boolean;
};

const props = withDefaults(defineProps<VBoxProps>(), {
  tag: 'div',
  padding: 'none',
  rounded: 'none',
  border: 'none',
  surface: 'base',
  clickable: false
});

const borderStyles = computed(() => {
  return SHARED_BORDER_CLASSES[props.border] || SHARED_BORDER_CLASSES.none;
});

const interactionStyles = computed(() => {
  if (!props.clickable) return '';
  return 'cursor-pointer select-none transition-all duration-200 active:scale-[0.98] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none';
});

const paddingStyles = computed(() => {
  return SHARED_PADDING_CLASS[props.padding] || SHARED_PADDING_CLASS.none;
});

const roundedStyles = computed(() => {
  return SHARED_ROUNDED_CLASS[props.rounded] || SHARED_ROUNDED_CLASS.md;
});

const surfaceStyles = computed(() => {
  return SHARED_SURFACE_CLASSES[props.surface] || SHARED_SURFACE_CLASSES.base;
});
</script>
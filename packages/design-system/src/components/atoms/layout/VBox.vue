<template>
  <component
    :is="tag"
    :class="[
      // Layout & Display
      inline ? 'inline-flex' : 'block',

      // Spacing & Shape
      paddingStyles,
      roundedStyles,
      borderStyles,

      // Surface Styles (Dynamic Intent/Surface resolution)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,

      // Interactive States (Only applied when clickable)
      clickable ? [surfaceStyle.hover, surfaceStyle.focus, interactionStyles] : ''
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Box Atom (The "Skin" layer)
 * A foundational container that manages padding, borders, backgrounds, and interactive surfaces.
 * Strictly adheres to Design Tokens to prevent "Magic Values".
 */
import { computed } from 'vue';
import type {
  TagToken,
  SpacingToken,
  RoundedToken,
  BorderToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_BORDER_CLASSES,
  SHARED_PADDING_CLASSES,
  SHARED_ROUNDED_CLASSES
} from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VBoxProps {
  /** HTML tag to render */
  tag?: TagToken;
  /** Internal spacing token */
  padding?: SpacingToken;
  /** Radius token */
  rounded?: RoundedToken;
  /** Border position token */
  border?: BorderToken;
  /** Visual priority token */
  attention?: AttentionToken;
  /** Explicit semantic intent token */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
  /** Render as inline-flex container */
  inline?: boolean;
  /** Adds pointer cursor and interactive focus/active states */
  clickable?: boolean;
}

const props = withDefaults(defineProps<VBoxProps>(), {
  tag: 'div',
  padding: 'none',
  rounded: 'none',
  border: 'none',
  inline: false,
  clickable: false
});

const borderStyles = computed(() => {
  return SHARED_BORDER_CLASSES[props.border] || SHARED_BORDER_CLASSES.none;
});

const paddingStyles = computed(() => {
  return SHARED_PADDING_CLASSES[props.padding] || SHARED_PADDING_CLASSES.none;
});

const roundedStyles = computed(() => {
  return SHARED_ROUNDED_CLASSES[props.rounded] || SHARED_ROUNDED_CLASSES.none;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});

const interactionStyles = computed(() => {
  return 'cursor-pointer select-none transition-all duration-200 active:scale-[0.98] outline-none';
});
</script>
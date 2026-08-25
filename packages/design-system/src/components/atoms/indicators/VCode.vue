<template>
  <code
    :class="[
      // Base Font & Rounding
      'font-mono rounded whitespace-nowrap',

      // Spacing & Layout Tokens
      paddingStyles,
      borderStyles,
      fontWeightStyles,
      sizeStyles.text,

      // Surface Styles
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      surfaceStyle.hover,
    ]"
  >
    <slot />
  </code>
</template>

<script setup lang="ts">
/**
 * Code Atom
 * Inline code snippet / token element integrated with Design Tokens
 * and Attention/Intent/Surface architecture.
 */
import { computed } from 'vue';
import type {
  AttentionToken,
  BorderToken,
  FontWeightToken,
  ComponentSizeToken,
  IntentToken,
  SpacingToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_BORDER_CLASSES,
  SHARED_FONT_WEIGHT_CLASSES,
  SHARED_COMPONENT_SIZE_CLASSES,
  SHARED_PADDING_CLASSES,
} from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VCodeProps {
  /** Padding size token */
  padding?: SpacingToken;
  /** Border position token */
  border?: BorderToken;
  /** Text size preset */
  size?: ComponentSizeToken;
  /** Font weight preset */
  weight?: FontWeightToken;
  /** Visual priority token */
  attention?: AttentionToken;
  /** Optional semantic intent color override */
  intent?: IntentToken;
  /** Optional surface type model */
  surface?: SurfaceToken;
}

const props = withDefaults(defineProps<VCodeProps>(), {
  padding: 'xs',
  border: 'none',
  size: 'xs',
  weight: 'normal',
  attention: 'secondary',
});

const paddingStyles = computed(() => {
  return SHARED_PADDING_CLASSES[props.padding] || SHARED_PADDING_CLASSES.xs;
});

const borderStyles = computed(() => {
  return SHARED_BORDER_CLASSES[props.border] || SHARED_BORDER_CLASSES.none;
});

const fontWeightStyles = computed(() => {
  return SHARED_FONT_WEIGHT_CLASSES[props.weight] || SHARED_FONT_WEIGHT_CLASSES.normal;
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.xs;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});
</script>
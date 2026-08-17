<template>
  <pre
    :class="[
      // Base Pre Block Styles
      'font-mono rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed',

      // Layout & Typography Tokens
      borderStyles,
      fontWeightStyles,
      sizeStyles.text,

      // Surface Styles (Dynamic Intent/Surface resolution)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      surfaceStyle.hover,
    ]"
  ><slot /></pre>
</template>

<script setup lang="ts">
/**
 * Pre Atom
 * Block-level preformatted text container integrated with Design Tokens
 * and Attention/Intent/Surface architecture.
 */
import { computed } from 'vue';
import type {
  AttentionToken,
  BorderToken,
  FontWeightToken,
  ComponentSizeToken,
  IntentToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_BORDER_CLASSES,
  SHARED_FONT_WEIGHT_CLASSES,
  SHARED_COMPONENT_SIZE_CLASSES,
} from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VPreProps {
  /** Border position token */
  border?: BorderToken;
  /** Text size preset */
  size?: ComponentSizeToken;
  /** Font weight preset */
  weight?: FontWeightToken;
  /** Visual priority token (defaults to 'secondary' for standard pre background) */
  attention?: AttentionToken;
  /** Optional semantic intent color override */
  intent?: IntentToken;
  /** Optional surface type model */
  surface?: SurfaceToken;
}

const props = withDefaults(defineProps<VPreProps>(), {
  border: 'all',
  size: 'xs',
  weight: 'normal',
  attention: 'secondary',
});

const borderStyles = computed(() => {
  return SHARED_BORDER_CLASSES[props.border] || SHARED_BORDER_CLASSES.all;
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
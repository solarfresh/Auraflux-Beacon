<template>
  <component
    :is="tag"
    :class="[
      borderStyles,
      fontWeightStyles,
      sizeStyles.text,

      // Surface Styles (Dynamic Intent/Surface resolution)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      surfaceStyle.hover,
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AttentionToken, BorderToken, FontWeightToken, ComponentSizeToken, TagToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_BORDER_CLASSES, SHARED_FONT_WEIGHT_CLASSES, SHARED_COMPONENT_SIZE_CLASSES, SURFACE_STYLE_MAP } from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VTypographyProps {
  /** HTML tag element */
  tag?: TagToken;
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
  /** Optional surface type (determines text contrast vs semantic shade) */
  surface?: SurfaceToken;
}

const props = withDefaults(defineProps<VTypographyProps>(), {
  tag: 'p',
  border: 'none',
  size: 'md',
  weight: 'normal',
});

const borderStyles = computed(() => {
  return SHARED_BORDER_CLASSES[props.border] || SHARED_BORDER_CLASSES.none;
});

const fontWeightStyles = computed(() => {
  return SHARED_FONT_WEIGHT_CLASSES[props.weight] || SHARED_FONT_WEIGHT_CLASSES.normal;
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.md;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});
</script>
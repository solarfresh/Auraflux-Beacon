<template>
  <component
    :is="tag"
    :class="[
      borderStyles,
      fontWeightStyles,
      sizeStyles.text,
      resolvedColorClass
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BorderToken, FontWeightToken, ComponentSizeToken, TagToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_BORDER_CLASSES, SHARED_FONT_WEIGHT_CLASSES, SHARED_COMPONENT_SIZE_CLASSES, SURFACE_STYLE_MAP } from '@auraflux/design-system/constants/theme';

export interface VTypographyProps {
  /** HTML tag element */
  tag?: TagToken;
  /** Border position token */
  border?: BorderToken;
  /** Text size preset */
  size?: ComponentSizeToken;
  /** Font weight preset */
  weight?: FontWeightToken;
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
  surface: 'soft',
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

// If intent is specified, derive the exact text color utility from SURFACE_STYLE_MAP.
// Otherwise, leave empty to naturally inherit foreground color from parent containers (e.g. VButton).
const resolvedColorClass = computed(() => {
  if (!props.intent) return '';
  return SURFACE_STYLE_MAP[props.intent][props.surface].text;
});
</script>
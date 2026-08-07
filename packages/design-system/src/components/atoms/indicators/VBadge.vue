<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full transition-colors',
      // Surface Mapping (Visual Properties)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      // Size Mapping
      sizeStyles.badge
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
/**
 * Badge Atom
 * A small status descriptor for highlighting state, counts, or categories.
 * Strictly adheres to Design Tokens and Attention/Intent/Surface architecture.
 */
import { computed } from 'vue';
import type { ComponentSizeToken, AttentionToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_COMPONENT_SIZE_CLASSES } from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VBadgeProps {
  /** Visual priority hierarchy token */
  attention?: AttentionToken;
  /** Explicit semantic intent token (e.g. 'success', 'danger') */
  intent?: IntentToken;
  /** Explicit surface container model token (e.g. 'soft', 'solid') */
  surface?: SurfaceToken;
  /** Physical scale of the badge */
  size?: ComponentSizeToken;
}

const props = withDefaults(defineProps<VBadgeProps>(), {
  attention: 'secondary',
  size: 'sm'
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.sm;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});
</script>
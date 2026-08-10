<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="[
      // Base styles
      'shrink-0 select-none bg-current opacity-20 transition-colors duration-150',

      // Vertical Orientation
      isVertical && [
        'inline-block align-middle w-px',
        lengthStyle.vertical
      ],

      // Horizontal Orientation
      !isVertical && [
        'block h-px',
        lengthStyle.horizontal
      ]
    ]"
  />
</template>

<script setup lang="ts">
/**
 * VDivider Atom
 * Pure Atom Indicator Component aligned with Design Tokens.
 * Renders a lightweight, zero-dependency semantic divider.
 */
import { computed } from 'vue';
import type {
  ContainerSizeToken
} from '@auraflux/design-system/interfaces/theme';
import { SHARED_LENGTH_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VDividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';
  /** Length/Height size constraint for the divider */
  size?: ContainerSizeToken;
}

const props = withDefaults(defineProps<VDividerProps>(), {
  orientation: 'vertical',
  size: 'sm',
});

const isVertical = computed(() => props.orientation === 'vertical');

const lengthStyle = computed(() => {
  return SHARED_LENGTH_CLASSES[props.size] || SHARED_LENGTH_CLASSES.sm;
});
</script>
<template>
  <div :class="containerClasses">
    <table :class="tableClasses">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import type { ComponentSizeToken, IntentToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_COMPONENT_SIZE_CLASSES, SURFACE_STYLE_MAP } from '@auraflux/design-system/constants/theme';

export interface VTableProps {
  /** Size variant controlling font size and padding density */
  size?: ComponentSizeToken;
  /** Intent variant mapped to SURFACE_STYLE_MAP */
  intent?: IntentToken;
  /** Enables zebra striping on alternating rows */
  striped?: boolean;
  /** Enables hover highlight state on rows */
  hoverable?: boolean;
  /** Controls outer border display */
  bordered?: boolean;
  /** Controls outer container drop shadow */
  shadow?: boolean;
  /** Enables horizontal scrolling when content overflows */
  overflowX?: boolean;
}

const props = withDefaults(defineProps<VTableProps>(), {
  size: 'sm',
  intent: 'neutral',
  striped: false,
  hoverable: true,
  bordered: true,
  shadow: false,
  overflowX: true,
});

// Provide table context for child components (VTableHead, VTableCell, VTableRow, etc.)
provide('vTableContext', {
  size: computed(() => props.size),
  intent: computed(() => props.intent),
  striped: computed(() => props.striped),
  hoverable: computed(() => props.hoverable),
});

const surfaceStyles = computed(() => SURFACE_STYLE_MAP[props.intent].solid);

const containerClasses = computed(() => [
  'w-full',
  surfaceStyles.value.bg,
  props.overflowX ? 'overflow-x-auto' : '',
  props.bordered ? `border ${surfaceStyles.value.border} rounded-lg` : '',
  props.shadow ? 'shadow-sm' : '',
]);

const tableClasses = computed(() => [
  'w-full text-left border-collapse',
  surfaceStyles.value.text,
  SHARED_COMPONENT_SIZE_CLASSES[props.size].text,
]);
</script>
<template>
  <tr :class="rowClasses">
    <slot />
  </tr>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import { SURFACE_STYLE_MAP } from '@auraflux/design-system/constants/theme';

export interface VTableRowProps {
  /** Optional override for intent variant mapped to SURFACE_STYLE_MAP */
  intent?: IntentToken;
  /** Manually force hover state on or off */
  hoverable?: boolean;
  /** Indicates whether the row is selected */
  selected?: boolean;
}

const props = defineProps<VTableRowProps>();

const tableContext = inject<{
  intent: Ref<IntentToken>;
  hoverable: Ref<boolean>;
}>('vTableContext', {
  intent: computed(() => 'neutral'),
  hoverable: computed(() => true),
});

const activeIntent = computed(() => props.intent ?? tableContext.intent.value);
const isHoverable = computed(() => props.hoverable ?? tableContext.hoverable.value);

const surfaceStyles = computed(() => SURFACE_STYLE_MAP[activeIntent.value]);

const rowClasses = computed(() => [
  'transition-colors',
  props.selected ? surfaceStyles.value.soft.bg : '',
  isHoverable.value ? surfaceStyles.value.solid.hover : '',
]);
</script>
<template>
  <td :class="cellClasses">
    <slot />
  </td>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import type { Alignment, ComponentSizeToken, SpacingToken } from '@auraflux/design-system/interfaces/theme';
import {
  SHARED_COMPONENT_SIZE_CLASSES,
  SHARED_PADDING_CLASSES,
  SHARED_TEXT_ALIGN_CLASS_MAP
} from '@auraflux/design-system/constants/theme';

export interface VTableCellProps {
  /** Text alignment inside the cell */
  align?: Alignment;
  /** Size variant override for padding density */
  size?: ComponentSizeToken;
  /** Explicit padding override mapped to SHARED_PADDING_CLASSES */
  padding?: SpacingToken;
  /** Column span for merged table cells */
  colspan?: number;
}

const props = withDefaults(defineProps<VTableCellProps>(), {
  align: 'start',
});

const tableContext = inject<{
  size: Ref<ComponentSizeToken>;
}>('vTableContext', {
  size: computed(() => 'sm'),
});

const activeSize = computed(() => props.size ?? tableContext.size.value);

const activePadding = computed<SpacingToken>(() => {
  if (props.padding) return props.padding;
  return activeSize.value as SpacingToken;
});

const cellClasses = computed(() => [
  SHARED_TEXT_ALIGN_CLASS_MAP[props.align],
  SHARED_PADDING_CLASSES[activePadding.value] ?? SHARED_PADDING_CLASSES.sm,
  SHARED_COMPONENT_SIZE_CLASSES[activeSize.value].text,
  'align-middle',
]);
</script>
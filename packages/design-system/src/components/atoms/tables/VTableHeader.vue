<template>
  <th :class="headerClasses">
    <slot />
  </th>
</template>

<script setup lang="ts">
import {
  SHARED_COMPONENT_SIZE_CLASSES,
  SHARED_PADDING_CLASSES,
  SHARED_TEXT_ALIGN_CLASS_MAP,
} from '@auraflux/design-system/constants/theme';
import type { Alignment, ComponentSizeToken, SpacingToken } from '@auraflux/design-system/interfaces/theme';
import { computed, inject, type Ref } from 'vue';

export interface VTableHeaderProps {
  /** Text alignment inside the header cell */
  align?: Alignment;
  /** Size variant override for padding density */
  size?: ComponentSizeToken;
  /** Explicit padding override mapped to SHARED_PADDING_CLASSES */
  padding?: SpacingToken;
}

const props = withDefaults(defineProps<VTableHeaderProps>(), {
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

const headerClasses = computed(() => [
  SHARED_TEXT_ALIGN_CLASS_MAP[props.align],
  SHARED_PADDING_CLASSES[activePadding.value] ?? SHARED_PADDING_CLASSES.sm,
  SHARED_COMPONENT_SIZE_CLASSES[activeSize.value].text,
  'font-semibold uppercase tracking-wider select-none',
]);
</script>
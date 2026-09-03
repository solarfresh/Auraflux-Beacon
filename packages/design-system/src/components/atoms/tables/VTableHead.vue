<template>
  <thead :class="headClasses">
    <slot />
  </thead>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import { SURFACE_STYLE_MAP } from '@auraflux/design-system/constants/theme';

export interface VTableHeadProps {
  /** Optional override for intent variant mapped to SURFACE_STYLE_MAP */
  intent?: IntentToken;
}

const props = defineProps<VTableHeadProps>();

const tableContext = inject<{
  intent: Ref<IntentToken>;
}>('vTableContext', {
  intent: computed(() => 'neutral'),
});

const activeIntent = computed(() => props.intent ?? tableContext.intent.value);
const surfaceStyles = computed(() => SURFACE_STYLE_MAP[activeIntent.value].soft);

const headClasses = computed(() => [
  surfaceStyles.value.bg,
  surfaceStyles.value.text,
  'border-b',
  surfaceStyles.value.border,
  'font-semibold',
]);
</script>
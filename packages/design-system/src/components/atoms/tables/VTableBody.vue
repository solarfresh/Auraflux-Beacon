<template>
  <tbody :class="bodyClasses">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_DIVIDE_INTENT_MAP } from '@auraflux/design-system/constants/theme';

export interface VTableBodyProps {
  /** Optional override for intent variant mapped to SURFACE_STYLE_MAP */
  intent?: IntentToken;
}

const props = defineProps<VTableBodyProps>();

const tableContext = inject<{
  intent: Ref<IntentToken>;
}>('vTableContext', {
  intent: computed(() => 'neutral'),
});

const activeIntent = computed(() => props.intent ?? tableContext.intent.value);
const bodyClasses = computed(() => [
  'divide-y',
  SHARED_DIVIDE_INTENT_MAP[activeIntent.value],
]);
</script>
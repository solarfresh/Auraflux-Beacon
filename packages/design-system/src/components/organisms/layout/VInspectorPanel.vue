<template>
  <VBox class="v-inspector-panel" :intent="intent" :surface="surface" :border="border">
    <VPanelHeader :title="title" :is-expanded="isExpanded" @toggle="toggle" />
    <VBox v-if="isExpanded" class="v-inspector-panel__content">
      <slot />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VPanelHeader from '@auraflux/design-system/components/molecules/layout/VPanelHeader.vue';

import type { IntentToken, SurfaceToken, BorderToken } from '@auraflux/design-system/interfaces/theme';

const props = withDefaults(defineProps<{
  isExpanded?: boolean;
  title: string;
  intent?: IntentToken;
  surface?: SurfaceToken;
  border?: BorderToken;
}>(), {
  isExpanded: true,
  intent: 'neutral',
  surface: 'soft',
  border: 'none'
});

const emit = defineEmits<{
  (e: 'update:isExpanded', value: boolean): void;
  (e: 'toggle'): void;
}>();

const toggle = () => {
  emit('update:isExpanded', !props.isExpanded);
  emit('toggle');
};
</script>

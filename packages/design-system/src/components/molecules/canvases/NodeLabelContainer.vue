<template>
  <VStack class="node-label-container" :class="`node-type-${type}`" gap="xs">
    <VBox class="header">
      <slot name="header" />
    </VBox>
    <VStack class="content" gap="xs">
      <VTypography variant="body1" weight="medium">{{ label }}</VTypography>
      <slot />
    </VStack>
    <VStack v-if="rationale || status" class="footer" gap="xs">
      <VTypography v-if="rationale" variant="caption" color="secondary">
        {{ rationale }}
      </VTypography>
      <VBox v-if="status" class="status">
        {{ status }}
      </VBox>
    </VStack>
  </VStack>
</template>

<script setup lang="ts">
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { NodeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';
import { onMounted } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  id: { type: String as PropType<ID>, required: true },
  label: { type: String, required: true },
  type: { type: String as PropType<NodeType>, required: true },
  rationale: { type: String, required: false },
  status: { type: String as PropType<EntityStatus>, required: false },
});

onMounted(() => {
  if (!props.id || !props.label) {
    console.warn(`[NodeLabelContainer] Missing mandatory fields for node: ${props.id || 'unknown'}`);
  }
});
</script>

<style scoped>
.node-label-container {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
}
</style>

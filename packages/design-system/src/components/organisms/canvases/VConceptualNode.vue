<template>
  <VTooltip v-if="props.data.rationale" :content="props.data.rationale" position="top-center">
    <VNodeLabelContainer
      :id="props.id"
      :label="props.data.label"
      :type="props.data.type"
      :content="props.data.content"
      :status="props.data.status"
      :handles="props.data.handles"
      class="v-conceptual-node group transition-all"
      :intent="props.selected ? 'brand' : nodeTheme.intent"
      :surface="nodeTheme.surface"
      rounded="lg"
      border="all"
      padding="sm"
      :is-editing="props.isEditing"
      @update:is-editing="$emit('update:isEditing', $event)"
      @update:label="handleLabelUpdate"
    >
      <template #header>
        <VCluster justify="between" align="center">
          <VTypography size="xs" weight="bold" class="uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {{ props.data.type }}
          </VTypography>
        </VCluster>
      </template>
    </VNodeLabelContainer>
  </VTooltip>
  <VNodeLabelContainer
    v-else
    :id="props.id"
    :label="props.data.label"
    :type="props.data.type"
    :content="props.data.content"
    :status="props.data.status"
    :handles="props.data.handles"
    class="v-conceptual-node group transition-all"
    :intent="props.selected ? 'brand' : nodeTheme.intent"
    :surface="nodeTheme.surface"
    rounded="lg"
    border="all"
    padding="sm"
    :is-editing="props.isEditing"
    @update:is-editing="$emit('update:isEditing', $event)"
    @update:label="handleLabelUpdate"
  >
    <template #header>
      <VCluster justify="between" align="center">
        <VTypography size="xs" weight="bold" class="uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {{ props.data.type }}
        </VTypography>
      </VCluster>
    </template>
  </VNodeLabelContainer>
</template>

<script setup lang="ts">
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VNodeLabelContainer from '@auraflux/design-system/components/molecules/canvases/VNodeLabelContainer.vue';
import VTooltip from '@auraflux/design-system/components/molecules/indicators/VTooltip.vue';
import { NODE_THEMES } from '@auraflux/design-system/constants/theme';
import type { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { NodeProps } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps<NodeProps<ConceptualNode> & {
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isEditing', value: boolean): void;
  (e: 'update:label', label: string): void;
}>();

const nodeTheme = computed(() => {
  return NODE_THEMES[props.data.type] || { intent: 'neutral', surface: 'solid' };
});

const handleLabelUpdate = (newLabel: string) => {
  emit('update:label', newLabel);
};
</script>

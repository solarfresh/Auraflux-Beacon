<template>
  <VBox
    :intent="intent"
    :surface="surface"
    :padding="padding"
    :border="border"
  >
    <template v-if="localNode">
      <VFormField label="Node Label" :error="labelError">
        <VInput v-model="localNode.label" @input="validateLabel" />
      </VFormField>

      <VFormField label="Node Type">
        <VSelect v-model="localNode.type" :options="nodeTypes" />
      </VFormField>

      <VFormField label="Rationale">
        <VTextarea v-model="localNode.rationale" />
      </VFormField>

      <VButton @click="submitUpdate" :disabled="!!labelError">Update Node</VButton>
    </template>
    <VEmptyState v-else title="No Node Selected" description="Select a node to inspect" icon="CursorArrowRays" />
  </VBox>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ConceptualNode, NodeType } from '@auraflux/design-system/interfaces/conceptual-map';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';

import type { IntentToken, SurfaceToken, SpacingToken, BorderToken } from '@auraflux/design-system/interfaces/theme';

const props = withDefaults(defineProps<{
  node: ConceptualNode | null;
  intent?: IntentToken;
  surface?: SurfaceToken;
  padding?: SpacingToken;
  border?: BorderToken;
}>(), {
  intent: 'neutral',
  surface: 'soft',
  padding: 'md',
  border: 'none'
});

const emit = defineEmits<{
  (e: 'update:node', node: ConceptualNode): void;
}>();

const localNode = ref<ConceptualNode | null>(null);
const labelError = ref<string | null>(null);

const nodeTypes: NodeType[] = [
  'EVENT', 'OUTCOME', 'BOUNDARY', 'ENTITY', 'FOCUS',
  'RESOURCE', 'CONCEPT', 'INSIGHT', 'QUERY', 'NAVIGATION', 'GROUP'
];

watch(() => props.node, (newNode) => {
  localNode.value = newNode ? { ...newNode } : null;
  labelError.value = null;
}, { immediate: true });

const validateLabel = () => {
  if (!localNode.value?.label || localNode.value.label.trim() === '') {
    labelError.value = 'Label is required';
  } else {
    labelError.value = null;
  }
};

const submitUpdate = () => {
  if (localNode.value && !labelError.value) {
    emit('update:node', { ...localNode.value });
  }
};
</script>

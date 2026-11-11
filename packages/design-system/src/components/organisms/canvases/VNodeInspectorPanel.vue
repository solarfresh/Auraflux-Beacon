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
        <VSelect v-model="localNode.type">
          <option v-for="t in nodeTypes" :key="t" :value="t">{{ t }}</option>
        </VSelect>
      </VFormField>

      <VFormField label="Status">
        <VSelect v-model="localNode.status">
          <option v-for="s in entityStatuses" :key="s" :value="s">{{ s }}</option>
        </VSelect>
      </VFormField>

      <VFormField label="Content">
        <VTextarea v-model="localNode.content" />
      </VFormField>

      <VFormField label="Rationale">
        <VTextarea v-model="localNode.rationale" />
      </VFormField>

      <VCluster spacing="xs" class="mt-4">
        <VButton @click="submitUpdate" :disabled="!!labelError" attention="primary" size="sm" class="flex-1">Update</VButton>
        <VButton @click="duplicateNode" attention="secondary" intent="neutral" size="sm">Dup</VButton>
        <VButton @click="deleteNode" attention="secondary" intent="danger" size="sm">Del</VButton>
      </VCluster>
    </template>
    <VEmptyState v-else title="No Node Selected" description="Select a node to inspect" icon="CursorArrowRays" />
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
import type { ConceptualNode, NodeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { EntityStatus } from '@auraflux/design-system/interfaces/core';
import { ref, watch } from 'vue';
import type { BorderToken, IntentToken, SpacingToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';

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
  (e: 'duplicate:node', node: ConceptualNode): void;
  (e: 'delete:node', id: string): void;
}>();

const localNode = ref<ConceptualNode | null>(null);
const labelError = ref<string | null>(null);

const nodeTypes: NodeType[] = [
  'EVENT', 'OUTCOME', 'BOUNDARY', 'ENTITY', 'FOCUS',
  'RESOURCE', 'CONCEPT', 'INSIGHT', 'QUERY', 'NAVIGATION', 'GROUP'
];

const entityStatuses: EntityStatus[] = [
  'DRAFT', 'REVIEW', 'LOCKED', 'ON_HOLD', 'ARCHIVED',
  'PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ACTIVE',
  'INACTIVE', 'DELETED'
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

const duplicateNode = () => {
  if (localNode.value) {
    emit('duplicate:node', { ...localNode.value });
  }
};

const deleteNode = () => {
  if (localNode.value) {
    emit('delete:node', localNode.value.id);
  }
};
</script>

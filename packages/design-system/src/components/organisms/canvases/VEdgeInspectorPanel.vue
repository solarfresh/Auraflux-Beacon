<template>
  <VBox
    :intent="intent"
    :surface="surface"
    :padding="padding"
    :border="border"
  >
    <template v-if="localEdgeData">
      <VFormField label="Label">
        <VInput v-model="localEdgeData.label" placeholder="Optional" />
      </VFormField>

      <VFormField label="Type">
        <VSelect v-model="localEdgeData.type">
          <option v-for="t in edgeTypes" :key="t" :value="t">{{ t }}</option>
        </VSelect>
      </VFormField>

      <VFormField :label="'Weight: ' + localEdgeData.weight">
        <VSlider v-model.number="localEdgeData.weight" :min="1" :max="5" :step="1" />
      </VFormField>

      <VFormField label="Evidence">
        <VTextarea v-model="localEdgeData.evidence" placeholder="Optional" />
      </VFormField>

      <VCluster spacing="xs" class="mt-4">
        <VActionGroup :actions="edgeActions" @action="handleAction" />
      </VCluster>
    </template>
    <VEmptyState v-else title="No Edge Selected" description="Select an edge to inspect" icon="CursorArrowRays" />
  </VBox>
</template>

<script setup lang="ts">
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VSlider from '@auraflux/design-system/components/atoms/forms/VSlider.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
import VActionGroup from '@auraflux/design-system/components/organisms/navs/VActionGroup.vue';
import type { ConceptualEdge, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ActionDefinition } from '@auraflux/design-system/interfaces/navs';
import type { BorderToken, IntentToken, SpacingToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  edge: ConceptualEdge | null;
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
  (e: 'update:edge', edge: ConceptualEdge): void;
  (e: 'delete:edge', id: string): void;
}>();

const edgeTypes: EdgeType[] = ['VALIDATES', 'CONSTRAINS', 'TRIGGERS', 'REF', 'LINK'];

const localEdgeData = ref<ConceptualEdge | null>(null);

watch(() => props.edge, (newEdge) => {
  localEdgeData.value = newEdge ? { ...newEdge } : null;
}, { immediate: true, deep: true });

const save = () => {
  if (!localEdgeData.value) return;

  // Defensive validation: weight restriction 1-5
  let weight = Math.max(1, Math.min(5, localEdgeData.value.weight));

  // Deep clone object to ensure data integrity
  const updatedEdge = JSON.parse(JSON.stringify({
    ...localEdgeData.value,
    weight
  }));

  emit('update:edge', updatedEdge);
};

const deleteEdge = () => {
  if (localEdgeData.value) {
    emit('delete:edge', localEdgeData.value.id);
  }
};

const edgeActions = computed<ActionDefinition[]>(() => {
  return [
    {
      id: 'update',
      label: 'Update',
      iconName: 'Check',
      tooltip: 'Save edge changes',
      disabled: false,
      onClick: save
    },
    {
      id: 'delete',
      label: 'Del',
      iconName: 'Trash',
      tooltip: 'Delete this edge',
      disabled: false,
      onClick: deleteEdge
    }
  ];
});

const handleAction = (actionId: string) => {
  if (actionId === 'update') {
    save();
  } else if (actionId === 'delete') {
    deleteEdge();
  }
};
</script>

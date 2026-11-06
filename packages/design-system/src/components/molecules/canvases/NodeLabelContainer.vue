<template>
  <VBox
    tag="div"
    :padding="padding"
    :rounded="rounded"
    :border="border"
    :intent="intent"
    :surface="surface"
    class="node-label-container"
    :class="`node-type-${type}`"
    @dblclick.stop="startEdit"
  >
    <VStack gap="xs">
      <VBox class="header">
        <slot name="header" />
      </VBox>
      <VStack class="content" gap="xs">
        <template v-if="isEditing">
          <VInput
            v-model="tempLabel"
            size="sm"
            @keydown.enter.stop="finishEdit"
            @keydown.esc.stop="cancelEdit"
            @blur="finishEdit"
            ref="inputRef"
            @click.stop
          />
        </template>
        <VTypography v-else variant="body1" weight="medium">{{ label }}</VTypography>
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

    <!-- Render VNodeHandles if provided -->
    <template v-if="handles && handles.length">
      <VNodeHandle
        v-for="handle in handles"
        :key="handle.id"
        :id="handle.id"
        :type="handle.type"
        :position="handle.position"
        :intent="handle.intent"
        :surface="handle.surface"
        :attention="handle.attention"
        :is-connectable="handle.isConnectable"
      />
    </template>
    <slot name="handles" />
  </VBox>
</template>

<script setup lang="ts">
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VNodeHandle from '@auraflux/design-system/components/atoms/canvases/VNodeHandle.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { ConceptualNodeHandle, NodeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';
import type { BorderToken, IntentToken, RoundedToken, SpacingToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { ref, nextTick, type PropType, onMounted } from 'vue';

const props = defineProps({
  id: { type: String as PropType<ID>, required: true },
  label: { type: String, required: true },
  type: { type: String as PropType<NodeType>, required: true },
  rationale: { type: String, required: false },
  status: { type: String as PropType<EntityStatus>, required: false },
  padding: { type: String as PropType<SpacingToken>, default: 'sm' },
  rounded: { type: String as PropType<RoundedToken>, default: 'lg' },
  border: { type: String as PropType<BorderToken>, default: 'all' },
  intent: { type: String as PropType<IntentToken>, default: 'neutral' },
  surface: { type: String as PropType<SurfaceToken>, default: 'solid' },
  handles: { type: Array as PropType<ConceptualNodeHandle[]>, required: false, default: () => [] },
  isEditable: { type: Boolean, default: true },
});

const emit = defineEmits(['update:label', 'edit-complete']);

const isEditing = ref(false);
const tempLabel = ref(props.label);
const inputRef = ref<InstanceType<typeof VInput> | null>(null);

const startEdit = () => {
  if (!props.isEditable) return;
  isEditing.value = true;
  tempLabel.value = props.label;
  nextTick(() => {
    inputRef.value?.$el.querySelector('input')?.focus();
  });
};

const finishEdit = () => {
  if (!isEditing.value) return;

  const trimmedLabel = tempLabel.value.trim();
  if (trimmedLabel !== '' && trimmedLabel !== props.label) {
    emit('update:label', trimmedLabel);
  }

  isEditing.value = false;
  emit('edit-complete', trimmedLabel);
};

const cancelEdit = () => {
  isEditing.value = false;
  tempLabel.value = props.label;
};

onMounted(() => {
  if (!props.id || !props.label) {
    console.warn(`[NodeLabelContainer] Missing mandatory fields for node: ${props.id || 'unknown'}`);
  }
});
</script>

<style scoped>
.node-label-container {
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
  cursor: pointer;
}
</style>

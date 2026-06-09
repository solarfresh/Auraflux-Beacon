<template>
  <VNodeShield
    :theme-class="props.themeClass"
    :selected="props.selected"
    :padding="props.padding"
  >
    <slot :node="nodeData" />

    <VNodeShape :status="props.status" :border-radius="12" />

    <VNodeActionGroup
      v-if="shouldRenderActionGroup"
      :status="props.status"
      @accept="handleAccept"
      @reject="handleReject"
      @delete="handleDelete"
    />

    <slot name="overlay" />
  </VNodeShield>
</template>

<script setup lang="ts">
/**
 * VNodeContainer Molecule
 * The physical shell for all canvas nodes.
 * Implements semantic border logic (Solid/Dashed) and hover/selection states.
 */
import { inject } from 'vue';
import VNodeShape from '@/components/atoms/canvases/VNodeShape.vue';
import VNodeShield from '@/components/atoms/canvases/VNodeShield.vue';
import VNodeActionGroup from '@/components/molecules/canvases/VNodeActionGroup.vue';
import { computed, ref, watch } from 'vue';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

const context = inject(ConceptualMapContextKey);

if (!context) {
  throw new Error(
    '[Architectural Violation] VNodeContainer must be rendered within the tree of a <ConceptualMapCanvas>.'
  );
}

const props = withDefaults(defineProps<{
  id: string
  // Entity status from backend (e.g., 'AI_EXTRACTED', 'LOCKED')
  status?: string
  // Selection state provided by Vue Flow
  selected?: boolean
  // Design Token: Semantic theme classes (e.g., 'bg-blue-50 border-blue-500')
  themeClass?: string
  // Accessibility and layout attributes
  padding?: 'none' | 'xs' | 'sm' | 'md'
}>(), {
  status: 'LOCKED',
  selected: false,
  themeClass: 'bg-white border-slate-200',
  padding: 'md'
})

const shouldRenderActionGroup = computed(() => {
  const isValidStatus = ['AI_EXTRACTED', 'USER_DRAFT'].includes(props.status);
  const isEditorClosed = !context.isNodeEditActive.value;

  return isValidStatus && isEditorClosed && props.selected;
});
const nodeData = computed(() => context.conceptualNodes.get(props.id));

/**
 * Technical Logic: Operation Handlers
 * These functions bubble events up to the Page/Canvas level where
 * the Exploration Store (exploration.ts) resides.
 */
const handleAccept = async () => {
  let node = nodeData.value;
  if (node !== undefined) {
    node.status = 'LOCKED';
    await context.updateConceptualMapNode(node, 'edit');

    if (props.status === 'AI_EXTRACTED') {
      context.recommendConceptualNodes();
    }
  }
}

const handleReject = () => {
  let node = nodeData.value;
  if (node !== undefined) {
    context.updateConceptualMapNode(node, 'delete');
  }
}

const handleDelete = () => {
  let node = nodeData.value;
  if (node !== undefined) {
    if (confirm('Delete this draft node?')) {
      context.updateConceptualMapNode(node, 'delete');
    }
  }
}
</script>

<style scoped>
</style>

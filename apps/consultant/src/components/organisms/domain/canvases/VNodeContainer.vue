<template>
  <VNodeShield
    :theme-class="props.themeClass"
    :selected="props.selected"
    :padding="props.padding"
  >
    <slot :node="nodeData" />

    <VNodeShape :status="props.status" :border-radius="12" />

    <VEntityCanvasQuickActions
      v-if="shouldRenderActionGroup"
      :status="props.status"
      class="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-150 nodrag nopan"
      @action="handleQuickAction"
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
import { inject, computed } from 'vue';
import { ConceptualMapContextKey } from '@/constants/injection-keys';
import type { EntityActionType } from '@/interfaces/core';

// Atoms & Shared Core Imports
import VNodeShape from '@/components/atoms/canvases/VNodeShape.vue';
import VNodeShield from '@/components/atoms/canvases/VNodeShield.vue';

// 🟢 Import the new unified micro-toolbar actions component and type definition
import VEntityCanvasQuickActions from '@/components/molecules/canvases/VEntityCanvasQuickActions.vue';

const context = inject(ConceptualMapContextKey);

if (!context) {
  throw new Error(
    '[Architectural Violation] VNodeContainer must be rendered within the tree of a <ConceptualMapCanvas>.'
  );
}

const props = withDefaults(defineProps<{
  id: string
  // Entity status from backend (e.g., 'AI_EXTRACTED', 'LOCKED', 'USER_DRAFT')
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

// --- Computed Analytical State Layers ---

const shouldRenderActionGroup = computed(() => {
  // Enhanced boundary: Allows quick-action toolbars to manage AI Extractions, Drafts, and Hold states.
  const isEditorClosed = !context.isNodeEditActive.value;

  return isEditorClosed && props.selected;
});

const nodeData = computed(() => context.conceptualNodes.get(props.id));

// --- 🟢 Reengineered Action Routing Stream ---

/**
 * Technical Responsibility: Orchestrates incoming single-click event requests
 * dispatched from the micro-toolbar layer and normalizes graph mutation streams.
 * * @param action Explicit action identifier derived from CanvasActionType
 */
const handleQuickAction = async (action: EntityActionType) => {
  const node = nodeData.value;
  if (!node) return;

  switch (action) {
    case 'ACCEPT':
    case 'LOCK':
      node.status = 'LOCKED';
      await context.updateConceptualMapNode(node, 'edit');
      break;

    case 'REJECT':
      // Map 'REJECT' directly to complete graph node extraction rollback
      await context.updateConceptualMapNode(node, 'delete');
      break;

    case 'HOLD':
      node.status = 'ON_HOLD';
      await context.updateConceptualMapNode(node, 'edit');
      break;

    case 'DRAFT':
      node.status = 'USER_DRAFT';
      await context.updateConceptualMapNode(node, 'edit');
      break;

    case 'DELETE':
      if (confirm('Delete this draft node permanently?')) {
        await context.updateConceptualMapNode(node, 'delete');
      }
      break;
  }
};
</script>

<style scoped>
/* Ensure smooth micro-interaction layouts on selection change */
.animate-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -35%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -40%) scale(1); }
}
</style>
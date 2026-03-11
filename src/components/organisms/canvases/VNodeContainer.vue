<template>
  <VNodeShield
    :theme-class="props.themeClass"
    :selected="props.selected"
    :padding="props.padding"
  >
    <slot :node="nodeData" />

    <VNodeShape :status="props.status" :border-radius="12" />

    <VNodeActionGroup
      v-if="props.status === 'AI_EXTRACTED' && props.selected"
      @accept="handleAccept"
      @reject="handleReject"
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
import VNodeShape from '@/components/atoms/canvases/VNodeShape.vue';
import VNodeShield from '@/components/atoms/canvases/VNodeShield.vue';
import VNodeActionGroup from '@/components/molecules/canvases/VNodeActionGroup.vue';
import { useExplorationStore } from '@/stores/exploration';
import { computed } from 'vue';

const store = useExplorationStore();

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

const nodeData = computed(() => store.conceptualNodes.get(props.id));

/**
 * Technical Logic: Operation Handlers
 * These functions bubble events up to the Page/Canvas level where
 * the Exploration Store (exploration.ts) resides.
 */
const handleAccept = () => {
  let node = nodeData.value;
  if (node !== undefined) {
    node.status = 'LOCKED';
    store.updateConceptualMapNode(node, 'edit');
  }
}

const handleReject = () => {
  let node = nodeData.value;
  if (node !== undefined) {
    store.updateConceptualMapNode(node, 'delete');
  }
}
</script>

<style scoped>
</style>

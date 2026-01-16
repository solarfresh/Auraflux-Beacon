<template>
  <aside class="h-full flex flex-col p-4 bg-white overflow-y-auto border-r border-gray-200">
    <ResearchFocusSection
      :focus="currentFocus"
      @edit="handleViewDetails"
    />

    <ExplorationViewsSection
      :views="canvasViews"
      :active-id="activeViewId"
      @switch="vId => emit('switch-canvas', vId)"
      @manage="(action, vId) => emit('manage-canvas', action, vId)"
    />

    <ActiveViewIndexSection
      :summary="nodeSummary"
      @navigate="nodeId => emit('navigate-canvas', nodeId)"
    />
  </aside>
</template>

<script setup lang="ts">
import type {
  CanvasView,
  ManagementType,
  NodeSummary
} from '@/interfaces/exploration';
import type { RefinedTopic } from '@/interfaces/workflow';

import ActiveViewIndexSection from '@/components/organisms/ActiveViewIndexSection.vue';
import ExplorationViewsSection from '@/components/organisms/ExplorationViewsSection.vue';
import ResearchFocusSection from '@/components/organisms/ResearchFocusSection.vue';

// --- PROPS ---

const props = defineProps<{
  /** Data structure holding the current research focus (Question, Keywords, Scope, Status). (U.S. 1) */
  currentFocus: RefinedTopic;
  /** Array of all available canvas views/maps. (U.S. 2) */
  canvasViews: CanvasView[];
  /** ID of the canvas view currently displayed in the center pane. (U.S. 2) */
  activeViewId: string;
  /** Summary count of high-value nodes in the active canvas (Insight, Query, Group, Resource). (U.S. 12) */
  nodeSummary: NodeSummary;
}>();

// --- EMITS ---

const emit = defineEmits<{
  /** Emitted when the user clicks to edit Focus details or view Reflection Log. (U.S. 1) */
  (e: 'view-details', type: ManagementType | 'reflection-log'): void;
  /** Emitted when the user clicks to switch the active canvas view. (U.S. 2) */
  (e: 'switch-canvas', viewId: string): void;
  /** Emitted when the user interacts with canvas management buttons (New, Rename, Delete). (U.S. 2) */
  (e: 'manage-canvas', action: 'create' | 'rename' | 'delete', viewId?: string): void;
  /** Emitted when the user clicks an item in the index to navigate the canvas (panTo/fitView). (U.S. 12) */
  (e: 'navigate-canvas', nodeId: string): void;
}>();

// --- HANDLERS ---

/**
 * Maps the click event to the appropriate view-details type for modal opening. (U.S. 1)
 */
function handleViewDetails(type: ManagementType | 'reflection-log') {
  emit('view-details', type);
}

// --- UTILITIES ---

/**
 * Returns the Tailwind class for status display based on feasibility.
 */
function getStatusClass(status: string): string {
  switch (status) {
    case 'High':
      return 'text-green-600 bg-green-50 px-2 py-0.5 rounded';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded';
    case 'Low':
      return 'text-red-600 bg-red-50 px-2 py-0.5 rounded';
    default:
      return 'text-gray-500';
  }
}

</script>

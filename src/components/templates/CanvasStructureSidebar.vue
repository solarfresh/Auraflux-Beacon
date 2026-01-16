<template>
  <div class="h-full flex flex-col p-4 bg-white overflow-y-auto">

    <div class="mb-6 pb-4 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">💡 Current Research Focus</h3>

      <div class="focus-item group cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
           @click="handleViewDetails('final-question')">
        <p class="text-xs font-medium text-blue-700">Question:</p>
        <p class="text-sm text-gray-800 line-clamp-2">
          {{ currentFocus.finalQuestion || 'Click to define Research Question' }}
        </p>
        <span class="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
      </div>

      <div class="focus-item group cursor-pointer hover:bg-blue-50 p-2 rounded mt-2 transition-colors"
           @click="handleViewDetails('keyword')">
        <p class="text-xs font-medium text-blue-700">Keywords:</p>
        <p class="text-sm text-gray-800 line-clamp-2">
          {{ currentFocus.keywords?.join(', ') || 'Click to define Keywords' }}
        </p>
        <span class="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
      </div>

      <div class="mt-3 text-xs flex justify-between">
        <span :class="getStatusClass(currentFocus.feasibilityStatus)">
          Feasibility: {{ currentFocus.feasibilityStatus }}
        </span>
        <span class="text-gray-500">
          Stability Score: {{ currentFocus.stabilityScore.toFixed(2) }}
        </span>
      </div>
    </div>

    <div class="mb-6 pb-4 border-b border-gray-200">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-semibold text-gray-700">🗺️ Exploration Views</h3>
        <button
          @click="emit('manage-canvas', 'create')"
          class="text-xs bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
          title="Create New Canvas View"
        >
          + New View
        </button>
      </div>

      <ul class="space-y-1">
        <li
          v-for="view in canvasViews"
          :key="view.id"
          @click="emit('switch-canvas', view.id)"
          :class="[
            'p-2 rounded cursor-pointer transition-colors text-sm truncate',
            view.id === activeViewId
              ? 'bg-blue-100 font-medium text-blue-800 border border-blue-300'
              : 'hover:bg-gray-100 text-gray-700'
          ]"
        >
          {{ view.name }}
          <span v-if="view.id === activeViewId" class="text-xs ml-1">(Active)</span>
        </li>
      </ul>
    </div>

    <div class="flex-1 overflow-y-auto">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">🔍 Active View Index</h3>

      <div class="space-y-3">
        <div class="index-section">
          <h4 class="text-xs font-medium text-purple-700 mb-1 flex justify-between items-center">
            Insight Nodes
            <span class="text-gray-500 font-normal">{{ nodeSummary.insight }}</span>
          </h4>
          <p v-if="nodeSummary.insight === 0" class="text-xs text-gray-400">No insights yet.</p>
          </div>

        <div class="index-section">
          <h4 class="text-xs font-medium text-red-700 mb-1 flex justify-between items-center">
            Query Nodes
            <span class="text-gray-500 font-normal">{{ nodeSummary.query }}</span>
          </h4>
          <p v-if="nodeSummary.query === 0" class="text-xs text-gray-400">No questions defined.</p>
          </div>

        <div class="index-section">
          <h4 class="text-xs font-medium text-green-700 mb-1 flex justify-between items-center">
            Group Nodes
            <span class="text-gray-500 font-normal">{{ nodeSummary.group }}</span>
          </h4>
          <p v-if="nodeSummary.group === 0" class="text-xs text-gray-400">No groups defined.</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CanvasView,
  NodeSummary,
  ManagementType
} from '@/interfaces/exploration';
import type { RefinedTopic } from '@/interfaces/workflow';

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

<style scoped>
/* Scoped styles for the sidebar components */
.focus-item {
  border-bottom: 1px dashed transparent; /* Base for visual feedback */
}
.focus-item:hover {
  border-bottom-color: #93c5fd; /* Subtle blue dash on hover */
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
<template>
  <div class="h-full flex flex-col bg-white">
    <div class="flex-shrink-0 border-b border-gray-200">
      <nav class="-mb-px flex space-x-4 px-4" aria-label="Tabs">
        <button
          @click="selectTab(1)"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 1,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 1
          }"
          class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150"
          aria-controls="tab-content-1"
          :aria-selected="activeTab === 1"
        >
          <slot name="tab-1-title">Tab 1</slot>
        </button>

        <button
          @click="selectTab(2)"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 2,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 2
          }"
          class="whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150"
          aria-controls="tab-content-2"
          :aria-selected="activeTab === 2"
        >
          <slot name="tab-2-title">Tab 2</slot>
        </button>

        </nav>
    </div>

    <div class="flex-1 overflow-y-auto" role="tabpanel">
      <div v-show="activeTab === 1" id="tab-content-1" class="h-full">
        <slot name="tab-1-content"></slot>
      </div>

      <div v-show="activeTab === 2" id="tab-content-2" class="h-full">
        <slot name="tab-2-content"></slot>
      </div>

      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// --- PROPS ---
const props = defineProps<{
  initialTab?: number;
}>();

// --- STATE ---
// Manages which tab is currently active. Defaults to 1.
const activeTab = ref(props.initialTab || 1);

// --- METHODS ---
function selectTab(tabNumber: number) {
  activeTab.value = tabNumber;
}

// --- LIFECYCLE ---
onMounted(() => {
  // Ensure the initial tab selection is respected on mount
  if (props.initialTab) {
    activeTab.value = props.initialTab;
  }
});
</script>

<style scoped>
/* Scoped styles are generally managed by utility classes (e.g., Tailwind CSS). */

/* Ensure the content area takes the remaining vertical space and allows scrolling */
.flex-1 {
  min-height: 0; /* Important for flex items to correctly manage overflow */
}
</style>
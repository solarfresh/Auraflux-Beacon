<template>
  <div class="h-full flex flex-col bg-white">
    <div class="flex-shrink-0 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 px-4" aria-label="Tabs" role="tablist">
        <VButton
          v-for="tab in tabs"
          :key="tab.id"
          variant="ghost"
          size="md"
          :class="[
            'relative rounded-none border-b-2 py-4 px-1 transition-all duration-150',
            activeTab === tab.id
              ? 'border-indigo-600'
              : 'border-transparent'
          ]"
          :aria-selected="activeTab === tab.id"
          role="tab"
          @click="selectTab(tab.id)"
        >
          <VTypography
            tag="span"
            size="sm"
            :weight="activeTab === tab.id ? 'bold' : 'medium'"
            :class="activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'"
          >
            <slot :name="`tab-${tab.id}-title`">{{ tab.label }}</slot>
          </VTypography>
        </VButton>
      </nav>
    </div>

    <div class="flex-1 overflow-y-auto" role="tabpanel">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="activeTab === tab.id"
        class="h-full"
      >
        <slot :name="`tab-${tab.id}-content`"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

/**
 * TabbedPanel Molecule
 * Organizes content into switchable views.
 * Correctly uses Button and Text atoms to maintain design system integrity.
 */
const props = defineProps({
  /** ID of the tab to be active on initial load */
  initialTab: {
    type: Number,
    default: 1,
  },
  /** Tab configuration array */
  tabs: {
    type: Array as () => Array<{ id: number; label: string }>,
    default: () => [
      { id: 1, label: 'Overview' },
      { id: 2, label: 'Details' }
    ],
  }
});

const activeTab = ref(props.initialTab);

function selectTab(id: number) {
  activeTab.value = id;
}
</script>

<style scoped>
/* Ensure the flex container doesn't collapse incorrectly */
.flex-1 {
  min-height: 0;
}
</style>
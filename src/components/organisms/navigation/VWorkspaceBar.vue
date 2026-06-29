<template>
  <VCluster
    gap="xs"
    align="center"
    class="bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm"
  >
    <VButton
      variant="tertiary"
      size="sm"
      icon-name="ChevronLeft"
      icon-only
      @click="cycleTool(-1)"
    />

    <VBox
      class="relative"
    >
      <VButton
        variant="secondary"
        size="sm"
        class="min-w-md"
        icon-name="ChevronDown"
        @click="showMenu = !showMenu"
      >
        {{ activeTool.label }}
        <!-- <VIcon name="ChevronDown" size="xs" class="ml-2 opacity-60" /> -->
      </VButton>

      <VDropdownMenu v-if="showMenu">
        <VDropdownItem
          v-for="tool in tools"
          :key="tool.id"
          :icon-name="tool.iconName"
          @click="selectTool(tool)"
        >
          {{ tool.label }}
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>

    <VButton
      variant="tertiary"
      size="sm"
      icon-name="ChevronRight"
      icon-only
      @click="cycleTool(1)"
    />
  </VCluster>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VDropdownMenu from '@/components/molecules/layout/VDropdownMenu.vue';
import VDropdownItem from '@/components/atoms/buttons/VDropdownItem.vue';

import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';

const router = useRouter();
const projectStore = useProjectStore();

const currentProjectId = computed(() => projectStore.currentProjectId);
const currentStage = computed(() => projectStore.currentStage);

const tools = [
  { id: 'chat', label: 'Consultation & Tools', iconName: 'ChatBubbleLeftRight', stage: 'consultation' },
  { id: 'map', label: 'Co-Working Map', iconName: 'RectangleGroup', stage: 'exploration' },
];

const showMenu = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const activeIndex = ref(0);
const activeTool = computed(() => {
  if (currentStage.value == 'EXPLORATION') {
    activeIndex.value = 1;
  } else if (currentStage.value == 'CONSULTATION') {
    activeIndex.value = 0;
  } else {
    activeIndex.value = 0;
  }

  return tools[activeIndex.value]
});

const selectTool = (tool: typeof tools[0]) => {
  const index = tools.findIndex(t => t.id === tool.id);
  if (index !== -1) {
    activeIndex.value = index;
    showMenu.value = false;
    router.push(`/projects/${currentProjectId.value}/${tool.stage}`);
  }
};

const cycleTool = (direction: number) => {
  let nextIndex = activeIndex.value + direction;
  if (nextIndex >= tools.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = tools.length - 1;
  activeIndex.value = nextIndex;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showMenu.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
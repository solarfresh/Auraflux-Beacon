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
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VDropdownMenu from '@/components/molecules/layout/VDropdownMenu.vue';
import VDropdownItem from '@/components/atoms/buttons/VDropdownItem.vue';

const tools = [
  { id: 'whitepaper', label: 'Whitepaper' },
  { id: 'map', label: 'Knowledge Map' },
  { id: 'gantt', label: 'Timeline' },
  { id: 'analyser', label: 'Data Analyser' }
];

const showMenu = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const activeTool = computed(() => tools[activeIndex.value]);

const selectTool = (tool: typeof tools[0]) => {
  const index = tools.findIndex(t => t.id === tool.id);
  if (index !== -1) {
    activeIndex.value = index;
    showMenu.value = false;
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
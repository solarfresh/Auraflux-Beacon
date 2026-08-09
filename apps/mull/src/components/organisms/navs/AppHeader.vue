<template>
  <VHeader
    title="Auraflux"
    :section="section"
    :show-back="showBack"
    @back="handleBack"
  >
    <template #center>
      <VWorkspaceBar
        :show-menu="showMenu"
        :tools="tools"
        :active-tool="activeTool"
        intent="brand"
        @click="showMenu = !showMenu"
        @select="selectTool"
        @next="nextTool"
        @prev="prevTool"
  />
    </template>
    <template #actions>
      <VHeaderActions
        :setting-items="settingItems"
        @toggle-notifications="toggleNotifications"
        @click-setting="clickSettings"
        @open-profile="openProfile"
        @logout="logout"
      />
    </template>
  </VHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import VHeaderActions from '@auraflux/design-system/components/organisms/navs/VHeaderActions.vue';
import VHeader from '@auraflux/design-system/components/organisms/navs/VHeader.vue';
import VWorkspaceBar from '@auraflux/design-system/components/organisms/navs/VWorkspaceBar.vue';

import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@auraflux/shared-core/stores/project';
import { useHeaderActions } from '@auraflux/shared-core/composables/useHeaderActions';
import { useWorkspaceBar } from '@auraflux/shared-core/composables/useWorkspaceBar';

import type { LinkItem } from '@auraflux/design-system/interfaces/navs';

interface AppTool extends LinkItem {
  tool: string;
}

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const {
  settingItems,
  toggleNotifications,
  openProfile,
  logout,
  clickSettings,
} = useHeaderActions();

const tools: AppTool[] = [
  { id: 'decision-twin-s2', label: 'Decision Twin Sandbox', iconName: 'GitFork', tool: 'mull' },
  { id: 'chat', label: 'Consultation & Tools', iconName: 'ChatBubbleLeftRight', tool: 'consultation' },
  { id: 'map', label: 'Co-Working Map', iconName: 'RectangleGroup', tool: 'exploration' },
];

const { activeTool, selectTool, nextTool, prevTool } = useWorkspaceBar<AppTool>({
  tools,
  defaultActiveId: 'mull',
  onSelect: (tool) => {
    router.push(`/projects/${projectStore.currentProjectId}/${tool.stage}`);
  },
});

const showMenu = ref(false);

// Logic derived from your original Header
const showBack = computed(() => route.name !== 'ProjectPage');

const section = computed(() => {
  // if (route.name === 'ProjectPage') return 'MISSION CONTROL';
  // if (route.name === 'AgentSettingsPage') return 'Agent Settings';
  // if (route.name === 'ModelProviderSettingsPage') return 'Model Providers';
  // if (route.name === 'AgentEditorPage') return agentStore.currentAgent?.name || '';
  // return projectStore.projectName;
  return '';
});

const handleBack = () => {
  // if (route.name === 'AgentEditorPage') {
  //   router.push({ name: 'AgentSettingsPage' });
  // } else {
  //   router.push({ name: 'ProjectPage' });
  // }
};
</script>

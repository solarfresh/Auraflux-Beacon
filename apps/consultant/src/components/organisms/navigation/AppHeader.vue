<template>
  <VHeader
    title="Auraflux"
    :section="section"
    :show-back="showBack"
    @back="handleBack"
  >
    <template #actions>
      <VHeaderActions />
    </template>
  </VHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import VHeaderActions from '@/components/organisms/navigation/VHeaderActions.vue';
import VHeader from '@auraflux/design-system/components/organisms/navs/VHeader.vue';

import { useRoute, useRouter } from 'vue-router';
import { useAgentStore } from '@/stores/agent';
import { useProjectStore } from '@/stores/project';

const route = useRoute();
const router = useRouter();
const agentStore = useAgentStore();
const projectStore = useProjectStore();

// Logic derived from your original Header
const showBack = computed(() => route.name !== 'ProjectPage');

const section = computed(() => {
  if (route.name === 'ProjectPage') return 'MISSION CONTROL';
  if (route.name === 'AgentSettingsPage') return 'Agent Settings';
  if (route.name === 'ModelProviderSettingsPage') return 'Model Providers';
  if (route.name === 'AgentEditorPage') return agentStore.currentAgent?.name || '';
  return projectStore.projectName;
});

const handleBack = () => {
  if (route.name === 'AgentEditorPage') {
    router.push({ name: 'AgentSettingsPage' });
  } else {
    router.push({ name: 'ProjectPage' });
  }
};
</script>

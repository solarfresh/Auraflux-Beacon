<template>
  <VCluster gap="md" align="center" class="flex-none min-w-40">
    <VEntityIdentity
      :show-back="showBack"
      :title="title"
      @back="handleBack"
    />
  </VCluster>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAgentStore } from '@/stores/agent';
import { useProjectStore } from '@/stores/project';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VEntityIdentity from '@/components/molecules/domain/VEntityIdentity.vue';

const route = useRoute();
const router = useRouter();
const agentStore = useAgentStore();
const projectStore = useProjectStore();

// Logic derived from your original Header
const showBack = computed(() => route.name !== 'ProjectPage');

const title = computed(() => {
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
<template>
  <VBox class="min-h-screen flex flex-col">
    <AppHeader />

    <RouterView />

    <VOverlayLoader
      v-if="authStore.isLoading"
      message="Loading application..."
      detail="Please wait while we initialize the research canvas."
    />
  </VBox>
</template>

<script setup lang="ts">
import AppHeader from '@/components/organisms/navs/AppHeader.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VOverlayLoader from '@auraflux/design-system/components/molecules/indicators/VOverlayLoader.vue';

import { useAgentStore } from '@/stores/agent';
import { useProjectStore } from '@/stores/project';
import { useProviderStore } from '@auraflux/shared-core/stores/provider';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const agentStore = useAgentStore();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const providerStore = useProviderStore();
const route = useRoute();
const router = useRouter();

watch(
  () => route.params.projectId,
  (newProjectId, oldProjectId) => {
    if (newProjectId && newProjectId !== oldProjectId) {
      if (!Array.isArray(newProjectId)) {
        projectStore.setCurrentProjectId(newProjectId);
        agentStore.fetchAgentsByProject(newProjectId);
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // Check for valid JWT cookie on initial load
  try {
    await Promise.all([
      authStore.checkAuthStatus(),
      projectStore.fetchProjects(),
      providerStore.fetchProviders(),
    ]);
  } catch (err: any) {
    router.push('/')
  }
});
</script>

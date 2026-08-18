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

import { useProjectStore } from '@/stores/project';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const projectStore = useProjectStore();
const route = useRoute();
const router = useRouter();

watch(
  () => route.params.projectId,
  (newProjectId, oldProjectId) => {
    if (newProjectId && newProjectId !== oldProjectId) {
      if (!Array.isArray(newProjectId)) {
        projectStore.setCurrentProjectId(newProjectId);
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // Check for valid JWT cookie on initial load
  try {
    await authStore.checkAuthStatus();
    await projectStore.fetchProjects();
  } catch (err: any) {
    router.push('/')
  }
});
</script>

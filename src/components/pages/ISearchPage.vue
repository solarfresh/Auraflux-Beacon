<template>
  <ISearchTemplate>
    <template #header>
      <ProjectHeader v-if="isProjectPage" />
      <VMissionHeader
        v-else
        :current-stage="projectStore.currentStage"
      />
    </template>

    <RouterView />
  </ISearchTemplate>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { useRoute } from 'vue-router';
import ISearchTemplate from '@/components/templates/ISearchTemplate.vue';
import ProjectHeader from '@/components/organisms/navigation/ProjectHeader.vue';
import VMissionHeader from '@/components/organisms/navigation/VMissionHeader.vue';

import { useAuthStore } from '@/stores/auth';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const projectStore = useProjectStore();
const route = useRoute();
const router = useRouter();

const isProjectPage = computed(() => route.name === 'ProjectPage' || route.path === '/isearch');

onMounted(async () => {
  // Check for valid JWT cookie on initial load
  try {
    await authStore.checkAuthStatus();
  } catch (err: any) {
    router.push('/')
  }
});
</script>

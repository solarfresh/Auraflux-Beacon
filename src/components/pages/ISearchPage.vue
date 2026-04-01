<template>
  <ISearchTemplate>
    <template #header>
      <VISearchHeader />
    </template>

    <RouterView />
  </ISearchTemplate>
</template>

<script setup lang="ts">
import VISearchHeader from '@/components/organisms/navigation/VISearchHeader.vue';
import ISearchTemplate from '@/components/templates/ISearchTemplate.vue';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Check for valid JWT cookie on initial load
  try {
    await authStore.checkAuthStatus();
  } catch (err: any) {
    router.push('/')
  }
});
</script>

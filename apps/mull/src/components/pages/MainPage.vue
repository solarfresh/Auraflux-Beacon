<template>
  <VBox class="min-h-screen flex flex-col">
    <AppHeader />

    <RouterView />

    <VOverlayLoader
      v-if="authStore.loading"
      message="Loading application..."
      detail="Please wait while we initialize the research canvas."
    />
  </VBox>
</template>

<script setup lang="ts">
import VOverlayLoader from '@auraflux/design-system/components/molecules/indicators/VOverlayLoader.vue';
import AppHeader from '@/components/organisms/navs/AppHeader.vue';

import { useAuthStore } from '@auraflux/shared-core/stores/auth';
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

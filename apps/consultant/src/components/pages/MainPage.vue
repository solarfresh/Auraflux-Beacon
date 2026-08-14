<template>
  <VBox class="min-h-screen flex flex-col">
    <AppHeader />

    <RouterView />

    <LoginModal
      :isOpen="loginStore.isOpen"
      @close="loginStore.closeModal"
    />

    <VOverlayLoader
      v-if="authStore.isLoading"
      message="Loading application..."
      detail="Please wait while we initialize the research canvas."
    />
  </VBox>
</template>

<script setup lang="ts">
import VOverlayLoader from '@auraflux/design-system/components/molecules/indicators/VOverlayLoader.vue';
import AppHeader from '@/components/organisms/navigation/AppHeader.vue';
import LoginModal from '@/components/organisms/modals/LoginModal.vue';

import { useAuthStore } from '@auraflux/shared-core/stores/auth';
import { useLoginStore } from '@/stores/login';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const loginStore = useLoginStore();
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

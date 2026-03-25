<template>
  <ISearchTemplate>
    <RouterView />
  </ISearchTemplate>
</template>

<script setup lang="ts">
import ISearchTemplate from '@/components/templates/ISearchTemplate.vue';
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

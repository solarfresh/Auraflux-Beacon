<template>
  <AppTemplate>
    <RouterView />
  </AppTemplate>
</template>

<script setup lang="ts">
import AppTemplate from '@/components/templates/AppTemplate.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  // 1. Check for valid JWT cookie on initial load
  authStore.checkAuthStatus();
});
</script>

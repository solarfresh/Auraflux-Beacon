<template>
  <VBox class="min-h-screen flex flex-col">

    <slot name="header"></slot>

    <slot></slot>

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
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VOverlayLoader from '@auraflux/design-system/components/molecules/indicators/VOverlayLoader.vue';
import LoginModal from '@/components/organisms/modals/LoginModal.vue';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';
import { useLoginStore } from '@/stores/login';

const authStore = useAuthStore();
const loginStore = useLoginStore();
</script>
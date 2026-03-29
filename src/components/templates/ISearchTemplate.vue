<template>
  <div class="min-h-screen flex flex-col">

    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-slate-100 shadow-sm">
      <slot name="header"></slot>
    </header>

    <main class="grow">
      <slot></slot>
    </main>

    <LoginModal
      :isOpen="loginStore.isOpen"
      @close="loginStore.closeModal"
    />

    <VOverlayLoader
      v-if="authStore.loading"
      message="Loading application..."
      detail="Please wait while we initialize the research canvas."
    />
  </div>
</template>

<script setup lang="ts">
import VOverlayLoader from '@/components/molecules/feedback/VOverlayLoader.vue';
import HeaderToolbar from '@/components/organisms/navigation/HeaderToolbar.vue';
import LoginModal from '@/components/organisms/modals/LoginModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useLoginStore } from '@/stores/login';
import { useNotificationStore } from '@/stores/notification';
import { useProjectStore } from '@/stores/project';

const projctStore = useProjectStore();
const authStore = useAuthStore();
const loginStore = useLoginStore();
const store = useNotificationStore();

const handleLoginClick = () => {
  loginStore.openModal();
};
</script>
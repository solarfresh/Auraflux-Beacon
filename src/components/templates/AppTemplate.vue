<template>
  <div class="min-h-screen flex flex-col">

    <HeaderToolbar
      :currentStep="workflowStore.currentStep"
      :isLoggedIn="authStore.isLoggedIn"
      @login="handleLoginClick"
      @logout="authStore.logoutUser"
      @exportShortcut="() => console.log('Export requested')"
    />

    <main class="flex-grow">
      <slot></slot>
    </main>

    <LoginModal
      :isOpen="loginStore.isOpen"
      @close="loginStore.closeModal"
    />

    <FullScreenLoader
      v-if="authStore.loading"
      message="Loading application..."
      detail="Please wait while we initialize the research canvas."
    />
  </div>
</template>

<script setup lang="ts">
import FullScreenLoader from '@/components/molecules/feedback/FullScreenLoader.vue';
import HeaderToolbar from '@/components/organisms/HeaderToolbar.vue';
import LoginModal from '@/components/organisms/modals/LoginModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useLoginStore } from '@/stores/login';
import { useNotificationStore } from '@/stores/notification';
import { useWorkflowStore } from '@/stores/workflow';

const workflowStore = useWorkflowStore();
const authStore = useAuthStore();
const loginStore = useLoginStore();
const store = useNotificationStore();

const handleLoginClick = () => {
  loginStore.openModal();
};
</script>
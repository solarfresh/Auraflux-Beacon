<template>
  <div class="min-h-screen flex flex-col">

    <HeaderToolbar
      :currentStep="mockCurrentStep"
      :isLoggedIn="authStore.isLoggedIn"
      @login="handleLoginClick"
      @logout="authStore.logoutUser"
      @exportShortcut="() => console.log('Export requested')"
    />

    <main class="flex-grow">
      <slot></slot>
    </main>

    <LoginModal
      :isOpen="isLoginModalOpen"
      @close="isLoginModalOpen = false"
    />

    <div v-if="authStore.loading" class="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <p class="text-xl text-indigo-600">Loading application...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderToolbar from '@/components/organisms/HeaderToolbar.vue';
import LoginModal from '@/components/molecules/LoginModal.vue';
import type { WorkflowStep } from '@/interfaces/search';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const isLoginModalOpen = ref(false);

const handleLoginClick = () => {
  isLoginModalOpen.value = true;
};

// NOTE: You would need a WorkflowStore to provide currentStep here
const mockCurrentStep = ref<WorkflowStep>('SEARCH');
</script>

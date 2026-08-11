<template>
  <VBox tag="div" class="landing-page min-h-screen bg-slate-50">
    <!-- Header Container -->
    <VHeader title="Auraflux" section="Mull" :show-back="false">
      <!-- Actions: Login Button only (No navigation links) -->
      <template #actions>
        <VButton
          intent="brand"
          attention="primary"
          size="sm"
          @click="isModalOpen = true"
        >
          Login
        </VButton>
      </template>
    </VHeader>

    <!-- Main Content -->
    <VBox tag="main">
      <HeroSection />
      <FeaturesSection />
    </VBox>

    <LoginModal
      :is-open="isModalOpen"
      v-model:username="username"
      v-model:password="password"
      :error="error"
      :is-submitting="isSubmitting"
      @close="isModalOpen = false"
      @login="handleLogin"
    />
  </VBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VHeader from '@auraflux/design-system/components/organisms/navs/VHeader.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import LoginModal from '@auraflux/design-system/components/organisms/modals/LoginModal.vue';
import HeroSection from '@/components/organisms/landings/HeroSection.vue';
import FeaturesSection from '@/components/organisms/landings/FeaturesSection.vue';

import { useAuthLogin } from '@auraflux/shared-core/composables/useAuthLogin';

const isModalOpen = ref(false);
const {
  username,
  password,
  error,
  isSubmitting,
  handleLogin
} = useAuthLogin({
  onSuccess: () => {
    isModalOpen.value = false;
  },
  redirectTo: '/projects/',
});
</script>
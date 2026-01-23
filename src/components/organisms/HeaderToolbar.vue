<template>
  <header class="bg-white shadow-md w-full border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

      <div class="flex items-center space-x-4">
        <Icon name="Target" type="solid" size="xl" color="indigo-600" />
        <Text tag="h1" size="2xl" weight="bold" color="gray-900">
          Strategic Research ISP
        </Text>
      </div>

      <div class="hidden md:block">
        </div>

      <div class="flex items-center space-x-3">
        <AuthButton
          :isLoggedIn="isLoggedIn"
          @login="$emit('login')"
          @logout="$emit('logout')"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import AuthButton from '@/components/molecules/actions/AuthButton.vue';
import type { ISPStep } from '@/interfaces/workflow';

// --- Props ---
const props = defineProps({
  /**
   * The current ISP stage of the workflow. Used to determine when export is available.
   */
  currentStep: {
    type: String as () => ISPStep,
    required: true,
  },
  /**
   * Authentication status of the user.
   */
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['login', 'logout']);
</script>
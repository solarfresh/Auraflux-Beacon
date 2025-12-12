<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full m-4" >
      <div class="p-6">

        <Text tag="h2" size="2xl" weight="bold" color="gray-900" class="mb-4">
          🔐 User Login
        </Text>
        <Text tag="p" size="sm" color="gray-600" class="mb-6">
          Enter your credentials to access your saved strategic canvas state.
        </Text>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <div>
            <Text tag="label" for="username" size="sm" weight="medium" color="gray-700" class="block mb-1">
              Username
            </Text>
            <Input
              id="username"
              v-model="username"
              type="text"
              required
              placeholder="Enter username"
              :disabled="isSubmitting"
            />
          </div>

          <div>
            <Text tag="label" for="password" size="sm" weight="medium" color="gray-700" class="block mb-1">
              Password
            </Text>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter password"
              :disabled="isSubmitting"
            />
          </div>

          <Text v-if="error" tag="p" size="sm" weight="medium" color="red-600">
            {{ error }}
          </Text>

          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting || !username || !password"
            class="w-full"
          >
            <Text tag="span" size="base" weight="medium" color="white">
              {{ isSubmitting ? 'Logging in...' : 'Login' }}
            </Text>
          </Button>
        </form>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Input from '@/components/atoms/Input.vue';
import Text from '@/components/atoms/Text.vue';
import Modal from '@/components/molecules/Modal.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

// --- Dependency Injection (Store) ---
const authStore = useAuthStore();

// --- Props & Emits ---
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

// --- Local State ---
const username = ref('');
const password = ref('');
const error = ref('');
const isSubmitting = ref(false);

// --- Methods (Business Logic) ---
const handleLogin = async () => {
  error.value = '';
  isSubmitting.value = true;

  try {
    const success = await authStore.loginUser(
      username.value,
      password.value,
    );

    if (success) {
      username.value = '';
      password.value = '';
      emit('close');
    } else {
      error.value = 'Login failed. Please check your credentials.';
    }

  } catch (err: any) {
    // Note: Assuming 'err' has a 'message' property or fall back to generic error
    error.value = err.message || 'An unexpected error occurred during login.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
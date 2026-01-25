<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
      <header class="pt-8 pb-6 px-8 text-center bg-gray-50/50 border-b border-gray-100">
        <div class="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <VIcon name="LockClosed" size="lg" class="text-indigo-600" />
        </div>
        <VTypography tag="h2" size="2xl" weight="bold" color="gray-900" class="mb-2">
          User Login
        </VTypography>
        <VTypography tag="p" size="sm" color="gray-500">
          Access your research initiatives and strategic workspace.
        </VTypography>
      </header>

      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <VTypography tag="label" for="username" size="sm" weight="bold" color="gray-700">
              Username
            </VTypography>
            <Input
              id="username"
              v-model="username"
              type="text"
              required
              placeholder="Your username"
              :disabled="isSubmitting"
              class="w-full"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <VTypography tag="label" for="password" size="sm" weight="bold" color="gray-700">
                Password
              </VTypography>
              </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              :disabled="isSubmitting"
              class="w-full"
            />
          </div>

          <div
            v-if="error"
            class="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-in slide-in-from-top-2"
          >
            <VIcon name="ExclamationCircle" size="xs" class="text-red-600 mt-0.5" />
            <VTypography tag="p" size="xs" weight="medium" color="red-600">
              {{ error }}
            </VTypography>
          </div>

          <div class="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              :disabled="isSubmitting || !username || !password"
              class="w-full flex justify-center py-3"
            >
              <VIcon v-if="isSubmitting" name="ArrowPath" size="sm" class="animate-spin mr-2" />
              {{ isSubmitting ? 'Verifying Account...' : 'Sign In' }}
            </Button>
          </div>
        </form>
      </div>

      <footer class="px-8 pb-8 text-center">
        <VTypography tag="p" size="xs" color="gray-400">
          By logging in, you agree to our research workspace protocols.
        </VTypography>
      </footer>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Atoms & Molecules
import Button from '@/components/atoms/actions/Button.vue';
import Input from '@/components/atoms/forms/Input.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import Modal from '@/components/molecules/overlays/Modal.vue';

/**
 * LoginModal: Handles user authentication flow.
 * * Uses global authStore for state management.
 * * Automatically refreshes or redirects on success.
 */
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

// --- Local State ---
const username = ref('');
const password = ref('');
const error = ref('');
const isSubmitting = ref(false);

// --- Business Logic ---
const handleLogin = async () => {
  if (isSubmitting.value) return;

  error.value = '';
  isSubmitting.value = true;

  try {
    const success = await authStore.loginUser(
      username.value,
      password.value,
    );

    if (success) {
      // Clear inputs for security
      username.value = '';
      password.value = '';

      // Close modal before refreshing or navigating
      emit('close');

      // Standard procedure for refreshing auth state across the app
      router.go(0);
    } else {
      error.value = 'Invalid username or password. Please try again.';
    }

  } catch (err: any) {
    error.value = err.message || 'The authentication server is currently unreachable.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
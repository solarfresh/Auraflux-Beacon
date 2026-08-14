import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';

export interface UseAuthLoginOptions {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useAuthLogin(options: UseAuthLoginOptions = {}) {
  const router = useRouter();
  const authStore = useAuthStore();

  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isSubmitting = ref(false);

  const handleLogin = async () => {
    if (isSubmitting.value) return;
    error.value = '';
    isSubmitting.value = true;

    try {
      const success = await authStore.loginUser(username.value, password.value);
      if (success) {
        options.onSuccess?.();

        const targetPath = options.redirectTo ?? '/projects/';
        await router.push(targetPath);
      } else {
        error.value = 'Invalid username or password.';
      }
    } catch (err: any) {
      error.value = err.message || 'Authentication server unreachable.';
    } finally {
      username.value = '';
      password.value = '';
      isSubmitting.value = false;
    }
  };

  return {
    username,
    password,
    error,
    isSubmitting,
    handleLogin,
  };
}
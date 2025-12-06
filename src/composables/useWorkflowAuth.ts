import { useAuthStore } from '@/stores/auth';
import { useLoginStore } from '@/stores/login';

export function useWorkflowAuth() {
  const authStore = useAuthStore();
  const loginModalStore = useLoginStore();

  /**
   * Checks if the user is currently logged in. If not, it triggers the
   * login modal to open.
   *
   * @returns {boolean} True if the user is logged in, false otherwise.
   */
  const ensureLoggedIn = (): boolean => {
    if (authStore.isLoggedIn) {
      return true;
    }

    // User is not logged in, trigger the login flow via the modal store
    loginModalStore.openModal();
    return false;
  };

  /**
   * Executes a given action function only if the user is authenticated.
   * If the user is not authenticated, the login modal is opened instead.
   * This simplifies logic in components like ActionBar or ChatInterface.
   *
   * @param action The function to execute if the user is logged in.
   */
  const executeAuthAction = (action: () => void) => {
    if (ensureLoggedIn()) {
      action();
    }
  };

  return {
    ensureLoggedIn,
    executeAuthAction,
  };
}
import type { User } from '@/interfaces/user';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { apiService } from '@/api/apiService';

export const useAuthStore = defineStore('auth', () => {
  // --- State ---

  // Use 'ref' to create reactive state properties
  const user = ref<User | null>(null);
  const loading = ref(false); // Tracks if the initial auth check is running

  // --- Getters (Computed Properties) ---

  // Use 'computed' to derive state
  const isLoggedIn = computed(() => !!user.value);

  // --- Actions (Methods) ---

  /**
   * Performs the initial check for authentication status (e.g., checking JWT cookie).
   * This is typically called once on application startup.
   */
  async function checkAuthStatus() {
    loading.value = true;
    try {
      // 1. Send request to backend endpoint (e.g., GET /api/user or GET /api/fetch-state)
      // If the request succeeds (status 200) because the JWT cookie is valid, the user is authenticated.

      // MOCK: Simulate an initial check that finds a valid user
      const response = await apiService.users.check.get();
      let user_info: User = response.data;

      if (user_info) {
        user.value = user_info;
      } else {
        // 401 Unauthorized or other error means the user is not logged in or the token expired
        user.value = null;
      }
    } catch (error) {
      console.error('Error during initial authentication check:', error);
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Handles user login after successful credentials submission.
   * Assumes tokens are set as HttpOnly cookies by the backend response.
   */
  async function loginUser(username: string, password: string) {
    try {
      // 1. Call POST /api/login endpoint
      const response = await apiService.users.login.create(username, password);
      let user_info = response.data;

      if (user_info) {
        // 3. Update local user state
        user.value = user_info;
        return true;
      } else {
        // Handle failed login (e.g., invalid credentials)
        throw new Error('Login failed.');
      }
    } catch (error) {
      user.value = null;
      throw error;
    }
  }

  /**
   * Logs the user out and clears the local state.
   */
  async function logoutUser() {
    // 1. Call POST /api/logout endpoint (to clear backend tokens/cookies)
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
        console.warn("Logout failed on server, proceeding with client cleanup.", error);
    }

    // 2. Clear local state
    user.value = null;

    // Note: The main app should refresh or redirect the user after logout.
  }

  // --- Return the public interface ---
  return {
    user,
    loading,
    isLoggedIn,
    checkAuthStatus,
    loginUser,
    logoutUser,
  };
});
import { defineStore } from 'pinia';
import { apiService } from '@auraflux/shared-core/api/apiService';

import type { TokenInfo, User } from '@auraflux/shared-core/interfaces/user';

interface AuthState {
  user: User | null;
  accessTokens: Record<string, TokenInfo>;
  isLoading: boolean;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessTokens: {},
    isLoading: false
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!state.user
    },
  },

  actions: {
    async checkAuthStatus(): Promise<void> {
      this.isLoading = true;

      try {
        const response = await apiService.auth.users.check.get();
        let user_info: User = response.data;

        if (user_info) {
          this.user = user_info;
        } else {
          this.user = null;
          throw new Error('User is not logged in or the token expired');
        }
      } catch (error) {
        console.error('Error during initial authentication check:', error);
        this.user = null;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchServiceToken(serviceName: string): Promise<void> {
      this.isLoading = true;

      try {
        const response = await apiService.auth.users.tokens.exchange(serviceName);
        if (response.data) {
          this.setServiceToken(serviceName, response.data.token, response.data.expiresAt);
        }
      } catch (error) {

      } finally {
        this.isLoading = false;
      }
    },

    async isServiceTokenExpired(serviceName?: string): Promise<boolean> {
      if (!serviceName) return true;

      const info = this.accessTokens[serviceName];
      if (!info) return true;

      return Date.now() >= info.expiresAt;
    },

    /**
     * Handles user login after successful credentials submission.
     * Assumes tokens are set as HttpOnly cookies by the backend response.
     */
    async loginUser(username: string, password: string): Promise<boolean> {
      try {
        // 1. Call POST /api/login endpoint
        const response = await apiService.auth.users.login.create(username, password);
        let user_info = response.data;

        if (user_info) {
          // 3. Update local user state
          this.user = user_info;
          return true;
        } else {
          // Handle failed login (e.g., invalid credentials)
          throw new Error('Login failed.');
        }
      } catch (error) {
        this.user = null;
        throw error;
      }
    },

    /**
     * Logs the user out and clears the local state.
     */
    async logoutUser(): Promise<void> {
    },

    async setServiceToken(serviceName: string, accessToken: string, expiresInSeconds: number): Promise<void> {
      const bufferSeconds = 60;
      const expiresAt = Date.now() + (expiresInSeconds - bufferSeconds) * 1000;

      this.accessTokens[serviceName] = {
        token: accessToken,
        expiresAt,
      };
    }

  }
});
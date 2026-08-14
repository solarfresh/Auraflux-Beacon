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
          this.setServiceToken(serviceName, response.data);
        }
      } catch (error) {
        console.error(`Error fetching service token for ${serviceName}:`, error);
      } finally {
        this.isLoading = false;
      }
    },

    async isServiceTokenExpired(serviceName?: string): Promise<boolean> {
      if (!serviceName) return false;

      const info = this.accessTokens[serviceName];
      if (!info || !info.exp) return true;

      return Date.now() >= info.exp;
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

    async parseJwt(token: string): Promise<TokenInfo | null> {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        return JSON.parse(jsonPayload) as TokenInfo;
      } catch (error) {
        console.error('Failed to parse JWT:', error);
        return null;
      }
    },

    async setServiceToken(serviceName: string, token: TokenInfo): Promise<void> {
      const decodedToken = await this.parseJwt(token.token);
      this.accessTokens[serviceName] = {
        ...token,
        ...decodedToken
      };
    }

  }
});
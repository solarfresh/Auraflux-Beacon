import { computed } from 'vue';

import type { LinkItem } from '@auraflux/design-system/interfaces/navs';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@auraflux/shared-core/stores/auth';

export function useHeaderActions() {
  const router = useRouter();
  const authStore = useAuthStore();

  const user = computed(() => authStore.user);

  const settingItems: LinkItem[] = [
    { label: 'Model Providers', iconName: 'CpuChip', route: '/settings/models' },
    { label: 'System Preferences', iconName: 'Cog8Tooth', route: '' }
  ];

  const toggleNotifications = () => console.log('Toggle Notifications');
  const openProfile = () => console.log('Toggle User Profile');
  const logout = () => console.log('User logout');

  const clickSettings = (item: { route?: string }) => {
    if (item.route) router.push(item.route);
  };

  return {
    user,
    settingItems,
    toggleNotifications,
    openProfile,
    logout,
    clickSettings,
  };
}
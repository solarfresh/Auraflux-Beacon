<template>
  <VCluster gap="md" align="center" justify="end" class="flex-none min-w-40">
    <VBox class="relative group">
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="Bell"
        icon-only
        @click="toggleNotifications"
      />
    </VBox>

    <VBox
      class="relative group"
    >
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="Cog6Tooth"
        icon-only
      />
      <VDropdownMenu
        attention="primary"
        class="hidden group-hover:block absolute top-full right-0"
      >
        <VDropdownItem
          attention="primary"
          v-for="item in settingItems"
          :key="item.label"
          :icon-name="item.iconName"
          @click="clickSettings(item.label, item.route)"
        >
          {{ item.label }}
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>

    <VBox
      class="relative group"
    >
<!--
      <VUserAvatar
        :src="user?.avatar"
        :status="'online'"
        attention="primary"
        size="sm"
        class="cursor-pointer"
      />
 -->
      <VButton
        attention="primary"
        border="none"
        size="sm"
        icon-name="User"
        icon-only
      />
      <VDropdownMenu
        class="hidden group-hover:block absolute top-full right-0"
        attention="primary"
      >
        <VDropdownItem attention="primary" icon-name="UserCircle" @click="openProfile">
          Account Profile
        </VDropdownItem>
        <VBox width="full" height="px" intent="brand" surface="solid" class="my-1" />
        <VDropdownItem attention="primary" icon-name="ArrowRightOnRectangle" @click="logout">
          Sign Out
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>
  </VCluster>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
// import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const settingItems = [
  { label: 'Model Providers', iconName: 'CpuChip', route: '/settings/models' },
  { label: 'System Preferences', iconName: 'Cog8Tooth', route: '' }
];

const toggleNotifications = () => console.log('Toggle Notifications');
const openProfile = () => console.log('Toggle User Profile');
const logout = () => console.log('User logout');

const clickSettings = (label: string, route: string) => {
  if (route) router.push(route);
};
</script>
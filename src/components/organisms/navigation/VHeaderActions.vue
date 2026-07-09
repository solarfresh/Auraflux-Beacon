<template>
  <VCluster gap="md" align="center" justify="end" class="flex-none min-w-40">
    <VBox class="relative group">
      <VButton
        variant="tertiary"
        size="sm"
        icon-name="Bell"
        icon-only
        @click="toggleNotifications"
      />
      <VBox
        top="1"
        right="1"
        width="2"
        height="2"
        background="rose-50"
        rounded="full"
        class="absolute border-2 border-white"
      />
    </VBox>

    <VBox
      tag="div"
      class="relative group"
      @mouseenter="openSettingsMenu"
      @mouseleave="closeSettingsMenu"
    >
      <VButton
        variant="tertiary"
        size="sm"
        icon-name="Cog6Tooth"
        icon-only
      />
      <VDropdownMenu
        class="group-hover:block"
        v-if="showSettingsMenu"
      >
        <VDropdownItem
          v-for="item in settingItems"
          :key="item.label"
          :icon-name="item.iconName"
          @click="clickSettings(item.label, item.route)"
        >
          {{ item.label }}
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>

    <VBox width="px" height="4" background="slate-50" />

    <VBox tag="div" class="relative group">
      <VUserAvatar
        :src="user?.avatar"
        :status="'online'"
        size="sm"
        class="cursor-pointer"
      />
      <VDropdownMenu class="hidden group-hover:block">
        <VDropdownItem icon-name="UserCircle" @click="openProfile">
          Account Profile
        </VDropdownItem>
        <VBox width="full" height="px" background="slate-50" class="my-1" />
        <VDropdownItem icon-name="ArrowRightOnRectangle" @click="logout">
          Sign Out
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>
  </VCluster>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@/components/atoms/buttons/VDropdownItem.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VDropdownMenu from '@/components/molecules/layout/VDropdownMenu.vue';
import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const showSettingsMenu = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const settingItems = [
  { label: 'Agent Settings', iconName: 'AdjustmentsVertical', route: '/settings/agents' },
  { label: 'Model Providers', iconName: 'CpuChip', route: '/settings/models' },
  { label: 'System Preferences', iconName: 'Cog8Tooth', route: '' }
];

const toggleNotifications = () => console.log('Toggle Notifications');
const openProfile = () => console.log('Toggle User Profile');
const logout = () => console.log('User logout');

const clickSettings = (label: string, route: string) => {
  if (route) router.push(route);
  showSettingsMenu.value = false;
};

const openSettingsMenu = () => {
  if (closeTimer) clearTimeout(closeTimer);
  showSettingsMenu.value = true;
};

const closeSettingsMenu = () => {
  closeTimer = setTimeout(() => { showSettingsMenu.value = false; }, 100);
};
</script>
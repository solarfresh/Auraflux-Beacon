<template>
  <VBox
    tag="header"
    :class="[
      'w-full sticky top-0 z-50 transition-all duration-300',
      variant === 'glass' ? 'backdrop-blur-md bg-white/80' : 'bg-white',
      hasShadow ? 'shadow-sm' : '',
      hasBorder ? 'border-b border-slate-200' : ''
    ]"
    class="min-h-16 flex items-center"
  >
    <VCluster
      justify="between"
      align="center"
      class="w-full px-6 max-w-7xl mx-auto h-full"
    >

      <VCluster gap="md" align="center" class="flex-none min-w-40">
        <VEntityIdentity
          :show-back="showBack"
          :title="title"
          @back="handleBack"
        />
      </VCluster>

      <VBox class="hidden md:flex grow justify-center px-8 max-w-2xl">
        <VISPStageNavigator v-if="showStage" />
        <VGlobalSearch v-else />
      </VBox>

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
              icon-name=ite.iconName
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
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@/components/atoms/buttons/VDropdownItem.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VEntityIdentity from '@/components/molecules/domain/VEntityIdentity.vue';
import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';
import VDropdownMenu from '@/components/molecules/layout/VDropdownMenu.vue';
import VISPStageNavigator from '@/components/molecules/navs/VISPStageNavigator.vue';
import { useAgentStore } from '@/stores/agent';
import { useAuthStore } from '@/stores/auth';
import { useProjectStore } from '@/stores/project';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const agentStore = useAgentStore();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const user = computed(() => authStore.user);

withDefaults(defineProps<{
  variant?: 'solid' | 'glass';
  hasShadow?: boolean;
  hasBorder?: boolean;
}>(), {
  variant: 'solid',
  hasShadow: false,
  hasBorder: true
});

let closeTimer: ReturnType<typeof setTimeout> | null = null;

const showSettingsMenu = ref(false);
const settingItems = ref([
  {
    label: 'Agent Settings',
    iconName: 'AdjustmentsVertical',
    route: '/settings/agents'
  },
  {
    label: 'Model Providers',
    iconName: 'CpuChip',
    route: '/settings/models'
  },
  {
    label: 'System Preferences',
    iconName: 'Cog8Tooth',
    route: ''
  }
]);
const showBack = computed(() => route.name !== 'ProjectPage');
const showStage = computed(() => ['InitiationPage', 'ExplorationPage'].includes(route.name as string));
const title = computed(() => {
  if (route.name === 'ProjectPage') return 'MISSION CONTROL';
  if (route.name === 'AgentSettingsPage') return 'Agent Settings';
  if (route.name === 'ModelProviderSettingsPage') return 'Model Providers';
  if (route.name === 'AgentEditorPage') return agentStore.currentAgent?.name || '';
  return projectStore.projectName;
});

const handleBack = () => {
  // Navigate back to the project list or previous context
  if (route.name === 'AgentEditorPage') {
    router.push({ name: 'AgentSettingsPage' });
  } else {
    router.push({ name: 'ProjectPage' });
  }
};
const logout = () => console.log('User logout');
const toggleNotifications = () => console.log('Toggle Notifications');
const openProfile = () => console.log('Toggle User Profile');
const clickSettings = (label: string, route: string) => {
  if (route) {
    router.push(route)
  }

  showSettingsMenu.value = false;
  console.log(`Opening Global System Settings: ${label}`);
};
const openSettingsMenu = () => {
  if (closeTimer) clearTimeout(closeTimer);
  showSettingsMenu.value = true;
}
const closeSettingsMenu = () => {
  closeTimer = setTimeout(() => {
    showSettingsMenu.value = false;
  }, 100);
}

</script>

<style scoped>
/* Ensure seamless transition when slot content changes */
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
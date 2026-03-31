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

        <VBox tag="div" class="relative group">
          <VButton
            variant="tertiary"
            size="sm"
            icon-name="Cog6Tooth"
            icon-only
          />
          <VDropdownMenu class="hidden group-hover:block">
            <VDropdownItem
              icon-name="AdjustmentsVertical"
              @click="router.push('/settings/agents')"
            >
              Agent Settings
            </VDropdownItem>
            <VDropdownItem icon-name="Cog8Tooth" @click="openSettings">
              System Preferences
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
import VUserAvatar from '@/components/molecules/feedback/VUserAvatar.vue';
import VDropdownMenu from '@/components/molecules/layout/VDropdownMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import VEntityIdentity from '@/components/molecules/domain/VEntityIdentity.vue';
import VISPStageNavigator from '@/components/molecules/navs/VISPStageNavigator.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';

const route = useRoute();
const router = useRouter();
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

const showBack = computed(() => route.name !== 'ProjectPage');
const showStage = computed(() => ['InitiationPage', 'ExplorationPage'].includes(route.name as string));
const title = computed(() => {
  if (route.name === 'ProjectPage') return 'MISSION CONTROL';
  if (route.name === 'AgentSettingsPage') return 'Agent Settings';
  return projectStore.projectName;
});

const handleBack = () => {
  // Navigate back to the project list or previous context
  router.push({ name: 'ProjectPage' });
};
const logout = () => console.log('User logout');
const toggleNotifications = () => console.log('Toggle Notifications');
const openProfile = () => console.log('Toggle User Profile');
const openSettings = () => {
  console.log('Opening Global System Settings');
};

</script>

<style scoped>
/* Ensure seamless transition when slot content changes */
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
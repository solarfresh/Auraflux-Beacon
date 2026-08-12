<template>
  <VHeader
    title="Auraflux"
    :section="section"
    :show-back="showBack"
    @back="handleBack"
  >
    <template #actions>
      <VHeaderActions
        :setting-items="settingItems"
        @toggle-notifications="toggleNotifications"
        @click-setting="clickSettings"
        @open-profile="openProfile"
        @logout="logout"
      />
    </template>
  </VHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import VHeaderActions from '@auraflux/design-system/components/organisms/navs/VHeaderActions.vue';
import VHeader from '@auraflux/design-system/components/organisms/navs/VHeader.vue';

import { useRoute, useRouter } from 'vue-router';
import { useHeaderActions } from '@auraflux/shared-core/composables/useHeaderActions';

const route = useRoute();
const router = useRouter();
const {
  settingItems,
  toggleNotifications,
  openProfile,
  logout,
  clickSettings,
} = useHeaderActions();

// Logic derived from your original Header
const showBack = computed(() => route.name !== 'ProjectPage');

const section = computed(() => {
  // if (route.name === 'ProjectPage') return 'MISSION CONTROL';
  // if (route.name === 'AgentSettingsPage') return 'Agent Settings';
  // if (route.name === 'ModelProviderSettingsPage') return 'Model Providers';
  // if (route.name === 'AgentEditorPage') return agentStore.currentAgent?.name || '';
  // return projectStore.projectName;
  return '';
});

const handleBack = () => {
  if (route.name === 'RepositoryPage') {
    router.push({
      name: 'MainPage',
      params: { id: 'test' },
    });
  }
  // else {
  //   router.push({ name: 'ProjectPage' });
  // }
};
</script>

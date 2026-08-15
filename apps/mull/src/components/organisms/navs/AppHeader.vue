<template>
  <VHeader
    title="Auraflux"
    :section="section"
    :show-back="showBack"
    @back="handleBack"
  >

    <template #center>
      <VTypography
        v-if="projectDescription"
        tag="span"
        size="sm"
        class="opacity-80 truncate"
      >
        {{ projectDescription }}
      </VTypography>
    </template>

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
import { computed } from 'vue';

import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VHeader from '@auraflux/design-system/components/organisms/navs/VHeader.vue';
import VHeaderActions from '@auraflux/design-system/components/organisms/navs/VHeaderActions.vue';

import { useProjectStore } from '@/stores/project';
import { useHeaderActions } from '@auraflux/shared-core/composables/useHeaderActions';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const {
  settingItems,
  toggleNotifications,
  openProfile,
  logout,
  clickSettings,
} = useHeaderActions();

// Logic derived from your original Header
const showBack = computed(() => route.name !== 'ProjectPage');

const projectId = computed(() => projectStore.currentProjectId);

const currentProject = computed(() => {
  if (!projectId.value) return null;
  return projectStore.projectMap.get(projectId.value) || null;
});

const section = computed(() => {
  return currentProject.value?.name || '';
});

const projectDescription = computed(() => {
  return currentProject.value?.description || '';
});

const handleBack = () => {
  if (route.name === 'MainPage') {
    projectStore.setCurrentProjectId(null);
    router.push({ name: 'ProjectPage' });
  } else {
    router.push({
      name: 'MainPage',
      params: { projectId: projectId.value },
    });
  }
};
</script>

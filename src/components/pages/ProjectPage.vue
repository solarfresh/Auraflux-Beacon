<template>
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <VBox class="max-w-7xl mx-auto w-full">
      <VStack gap="lg">
        <VBox
          background="white"
          padding="md"
          rounded="lg"
          class="border border-slate-200/60 shadow-sm"
        >
          <VProjectToolbar
            v-model="selectorState"
            @create="isCreateModalOpen = true"
          />
        </VBox>

        <VBox v-if="hasProjects || isFiltering" class="max-w-7xl mx-auto w-full px-6">
          <VGrid cols="1 sm:2 lg:3 xl:4" gap="lg">
            <VInteractivePlaceholder
              label="Start New Research"
              icon-name="Plus"
              class="h-48"
              @click="isCreateModalOpen = true"
            />
            <VProjectCard
              v-for="project in filteredProjects"
              :key="project.id"
              :project="project"
              @click="navigateToProject(project.id, project.currentStage)"
            />
          </VGrid>
        </VBox>

        <VEmptyState
          v-else
          title="No research projects yet"
          description="Use the toolbar above to create your first workspace."
          icon="FolderPlus"
        />
      </VStack>
    </VBox>

  </VBox>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Resource Molecules
import VProjectToolbar from '@/components/molecules/resources/VProjectToolbar.vue';
import VProjectCard from '@/components/molecules/resources/VProjectCard.vue';
import VInteractivePlaceholder from '@/components/molecules/resources/VInteractivePlaceholder.vue';

// Feedback Molecules
import VEmptyState from '@/components/molecules/feedback/VEmptyState.vue';
import VModal from '@/components/molecules/feedback/VModal.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

import type { ID } from '@/interfaces/core';
import type { ISPStage, Project } from '@/interfaces/project';
import type { BaseSelectorState } from '@/interfaces/indicators';

const router = useRouter();
const projectStore = useProjectStore();

// --- State Management ---
const isFiltering = ref(false);
const isCreateModalOpen = ref(false);

const selectorState = ref<BaseSelectorState>({
  filter: 'LOCKED',
  sorter: 'EDITED'
});

// --- Logic: Filtering & Sorting ---
const filteredProjects = computed((): Project[] => {
  let list = Array.from(projectStore.projects.values());

  isFiltering.value = false;
  // Filter Logic
  if (selectorState.value.filter !== 'ALL') {
    isFiltering.value = true;
    list = list.filter(p => p.status === selectorState.value.filter);
  }

  // Sort Logic
  return [...list].sort((a, b) => {
    return selectorState.value.sorter === 'EDITED'
      ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

const hasProjects = computed(() => projectStore.projects.size > 0);

onMounted(async () => {
  await projectStore.loadProjects();
});

const resetFilters = () => {
  selectorState.value.filter = 'ALL';
};

const navigateToProject = (projectId: ID, currentStage: ISPStage) => {
  projectStore.setCurrentProjectId(projectId);
  router.push(`/isearch/${projectId}/${currentStage.toLowerCase()}/`)
};
</script>
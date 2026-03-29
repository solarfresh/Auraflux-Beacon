<template>
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">

    <VBox padding-x="lg" padding-top="lg" padding-bottom="xl" class="max-w-7xl mx-auto w-full">
      <VStack gap="lg">

        <VBox
          background="white"
          padding="md"
          rounded="lg"
          class="border border-slate-200/60 shadow-sm"
        >
          <VProjectToolbar
            v-model="toolbarState"
            @create="isCreateModalOpen = true"
          />
        </VBox>

        <VGrid v-if="hasProjects || isFiltering" cols="1 sm:2 lg:3 xl:4" gap="lg">
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
            @click="navigateToProject(project.id)"
          />
        </VGrid>

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
import { ref, computed } from 'vue';
// import { useProjectStore } from '@/stores/project'; // 假設的 Pinia Store

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

import type { Project } from '@/interfaces/project';

// --- State Management ---
// const projectStore = useProjectStore();
const hasProjects = ref(false);
const isFiltering = ref(false);
const isCreateModalOpen = ref(false);

const toolbarState = ref({
  filter: 'active' as const,
  sort: 'edited' as const
});

// --- Logic: Filtering & Sorting ---
const filteredProjects = computed((): Project[] => {
  return [];
  // let list = projectStore.projects;

  // // 1. Filter Logic
  // if (toolbarState.value.filter !== 'all') {
  //   list = list.filter(p => p.status === toolbarState.value.filter);
  // }

  // // 2. Sort Logic
  // return [...list].sort((a, b) => {
  //   return toolbarState.value.sort === 'edited'
  //     ? b.updatedAt - a.updatedAt
  //     : b.createdAt - a.createdAt;
  // });
});

const resetFilters = () => {
  // toolbarState.value.filter = 'all';
};

const navigateToProject = (id: string) => {
  // Router logic to /projects/:id
};
</script>
<template>
  <VBox tag="main" background="slate-50" class="min-h-screen">
    <VBox background="white" padding-x="lg" padding-y="lg" border="bottom" class="shadow-sm">
      <VStack gap="xs">
        <VTypography tag="h1" size="xl" weight="bold" color="slate-900">
          Research Workspaces
        </VTypography>
        <VTypography size="sm" color="slate-500">
          Manage your AI-assisted research projects and multi-agent workflows.
        </VTypography>
      </VStack>
    </VBox>

    <VBox padding="lg">
      <VStack gap="lg">
        <VProjectToolbar
          v-model="toolbarState"
          @create="isCreateModalOpen = true"
        />

        <VGrid v-if="hasProjects || isFiltering" cols="1 sm:2 xl:3" gap="lg">
          <VInteractivePlaceholder
            label="Start New Research"
            icon-name="Plus"
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
          title="No projects found"
          description="Create your first research workspace to get started with Auraflux agents."
          icon="FolderPlus"
        >
          <template #actions>
            <VButton variant="primary" icon-name="Plus" @click="isCreateModalOpen = true">
              Create First Project
            </VButton>
          </template>
        </VEmptyState>
      </VStack>
    </VBox>
<!--
    <VModal v-model:open="isCreateModalOpen" title="Create New Project">
       <VStack gap="md" padding="md">
         <VTypography>Configure your new research agent workspace...</VTypography>
         </VStack>
    </VModal>
 -->
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
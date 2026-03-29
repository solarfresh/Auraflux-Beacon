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
              @click="navigateToProject(project.id)"
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

import type { Project } from '@/interfaces/project';
import type { SelectorState, FilterState } from '@/interfaces/indicators';

const projectStore = useProjectStore();

// --- State Management ---
const isFiltering = ref(false);
const isCreateModalOpen = ref(false);

const selectorState = ref<SelectorState>({
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

const navigateToProject = (id: string) => {
  // Router logic to /projects/:id
};
</script>
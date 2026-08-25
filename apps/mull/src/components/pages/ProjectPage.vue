<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" class="max-w-7xl mx-auto w-full">
      <VStack gap="lg">
        <VBox
          padding="md"
          rounded="lg"
          class="shadow-sm"
        >
          <VProjectToolbar
            v-model="selectorState"
            @create="isEditModalOpen = true"
          />
        </VBox>

        <VBox v-if="hasProjects || isFiltering" class="max-w-7xl mx-auto w-full px-6">
          <VGrid cols="1 sm:2 lg:3 xl:4" gap="lg">
            <VInteractivePlaceholder
              intent="neutral"
              surface="soft"
              border="dashed"
              label="Start New Project"
              icon-name="Plus"
              class="h-48"
              @click="isEditModalOpen = true"
            />
            <ProjectCard
              v-for="project in filteredProjects"
              :key="project.id"
              :project="project"
              @click="navigateToProject(project.id)"
            />
          </VGrid>
        </VBox>

        <VBox
          v-else
          class="max-w-7xl
          mx-auto w-full px-6 pt-16"
        >
          <VEmptyState
            title="No projects yet"
            description="Use the toolbar above to create your first workspace."
            icon="FolderPlus"
          />
        </VBox>
      </VStack>
    </VBox>
  </VBox>

  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <ProjectModal
      :is-open="isEditModalOpen"
      :project="localProject"
      :is-new="true"
      @cancel="isEditModalOpen = false"
      @confirm="handleProjectEditting"
    />
  </VBox>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';

// Layout Atoms
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VProjectToolbar, {type ProjectSelectorState} from '@auraflux/design-system/components/organisms/navs/VProjectToolbar.vue';
import ProjectCard from '@/components/organisms/projects/ProjectCard.vue';
import VInteractivePlaceholder from '@auraflux/design-system/components/molecules/resources/VInteractivePlaceholder.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
import ProjectModal from '@/components/organisms/projects/ProjectModal.vue';

import type { ID } from '@auraflux/design-system/interfaces/core';
import type { Project } from '@/interfaces/project';

const router = useRouter();
const projectStore = useProjectStore();

const localProject = ref<Project>({
  id: '',
  name: '',
  description: '',
  status: 'LOCKED',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// --- State Management ---
const isFiltering = ref(false);
const isEditModalOpen = ref(false);
const selectorState = ref<ProjectSelectorState>({
  filter: 'LOCKED',
  sorter: 'EDITED'
});

const filteredProjects = computed((): Project[] => {
  let list = projectStore.projects;

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

const hasProjects = computed(() => projectStore.projects.length > 0);

const handleProjectEditting = async () => {
  localProject.value = {
    id: '',
    name: '',
    description: '',
    status: 'LOCKED',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  projectStore.createProject(localProject.value);
};

const navigateToProject = (projectId: ID) => {
  router.push({
    name: 'MainPage',
    params: { projectId: projectId },
  });
};
</script>
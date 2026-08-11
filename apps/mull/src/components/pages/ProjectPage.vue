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
<!--
            <VProjectCard
              v-for="project in filteredProjects"
              :key="project.id"
              :project="project"
              @click="navigateToProject(project.id, project.currentStage)"
            />
             -->
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
<!--
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <ProjectModal
      :is-open="isEditModalOpen"
      :project="localProject"
      :is-new="true"
      @cancel="isEditModalOpen = false"
      @confirm="handleProjectEditting"
    />
  </VBox>
 -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// import { useRouter } from 'vue-router';

// Layout Atoms
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VProjectToolbar, {type ProjectSelectorState} from '@auraflux/design-system/components/organisms/navs/VProjectToolbar.vue';
// import VProjectCard from '@/components/organisms/projects/VProjectCard.vue';
import VInteractivePlaceholder from '@auraflux/design-system/components/molecules/resources/VInteractivePlaceholder.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
// import ProjectModal from '@/components/organisms/projects/ProjectModal.vue';
// import type { ID } from '@auraflux/design-system/interfaces/core';

// --- State Management ---
const isFiltering = ref(false);
const isEditModalOpen = ref(false);
const selectorState = ref<ProjectSelectorState>({
  filter: 'LOCKED',
  sorter: 'EDITED'
});

const hasProjects = computed(() => 0);

</script>
<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="sm" class="max-w-5xl mx-auto w-full">
      <!-- ========================================== -->
      <!-- 1. Header Area: RepositoryToolbar Organism -->
      <!-- ========================================== -->
      <RepositoryToolbar
        v-model:search-query="repositoryStore.searchQuery"
        v-model:selected-domain="repositoryStore.selectedDomain"
        :total-chunks="totalChunks"
        :file-count="repositoryStore.files.length"
        :domains="repositoryStore.domains"
        @refresh="repositoryStore.refreshData"
      />

      <!-- ========================================== -->
      <!-- 2. Main Content Area: Master-Detail Layout -->
      <!-- ========================================== -->

      <VCluster
        align="stretch"
        fullWidth
        class="flex-1 min-h-0 overflow-hidden"
      >
        <!-- Left Area: Master File List -->
        <RepositoryFileList
          :files="repositoryStore.filteredFiles"
          :selected-id="repositoryStore.selectedFileId"
          @delete="deleteFile"
          @select="repositoryStore.selectFile"
          @upload="uploadFile"
        />

        <!-- Right Area: Detail Chunk List -->
        <VBox
          tag="main"
          padding="lg"
          class="flex-1 h-full overflow-y-auto"
        >
          <VStack gap="md" align="stretch" class="max-w-4xl mx-auto">
            <!-- Active File Header Bar -->
            <VBox
              border="bottom"
              intent="neutral"
              surface="solid"
              padding="none"
              class="pb-2"
            >
              <VCluster justify="between" align="center" fullWidth>
                <VSectionHeader
                  :title="activeFile ? activeFile.fileName : 'All Chunks'"
                  icon="DocumentText"
                  size="md"
                  weight="bold"
                >
                  <template #extra>
                    <VBadge attention="secondary" size="sm" class="font-mono">
                      {{ filteredChunks.length }} Chunks Found
                    </VBadge>
                  </template>
                </VSectionHeader>
              </VCluster>
            </VBox>

            <!-- Chunk Cards List -->
            <template v-if="filteredChunks.length > 0">
              <ChunkCard
                v-for="chunk in filteredChunks"
                :key="chunk.id"
                :chunk="chunk"
                class="shadow-md"
              />
            </template>

            <!-- Empty State -->
            <VBox
              v-else
              padding="xl"
              rounded="lg"
              border="all"
            >
              <VStack gap="xs" align="center" justify="center" class="text-center">
                <VIcon name="FolderOpen" size="lg" type="outline" class="opacity-40" />
                <VTypography tag="p" size="sm" weight="medium">
                  No matching chunks found
                </VTypography>
              </VStack>
            </VBox>
          </VStack>
        </VBox>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * RepositoryView Page Component
 * Renders the primary Master-Detail layout for exploring repository files and chunk cards.
 * Refactored using Layout Atoms (VBox, VStack, VCluster) and Organisms.
 */
import { computed, watch } from 'vue';

// Design System Components
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

// Domain Organisms / Molecules
import RepositoryToolbar from '@/components/organisms/repositories/RepositoryToolbar.vue';
import RepositoryFileList from '@/components/organisms/repositories/RepositoryFileList.vue';
import ChunkCard from '@/components/organisms/repositories/RepositoryChunkCard.vue';

import type { ID } from '@auraflux/design-system/interfaces/core';

import { useProjectStore } from '@/stores/project';
import { useRepositoryStore } from '@/stores/repository';

const projectStore = useProjectStore();
const repositoryStore = useRepositoryStore();

const activeFile = computed(() => repositoryStore.activeFile);
const totalChunks = computed(() => repositoryStore.totalChunks);
const filteredChunks = computed(() => repositoryStore.filteredChunks);

watch(() => projectStore.currentProjectId, async (newVal) => {
  if (newVal) {
    await repositoryStore.fetchData(newVal);
  }
}, { immediate: true });

const deleteFile = (fileId: ID) => {
  if (!projectStore.currentProjectId) return;
  repositoryStore.deleteFile(projectStore.currentProjectId, fileId);
}

const uploadFile = (files: File[]) => {
  if (!projectStore.currentProjectId) return;
  repositoryStore.uploadRepositoryFiles(projectStore.currentProjectId, files);
}
</script>
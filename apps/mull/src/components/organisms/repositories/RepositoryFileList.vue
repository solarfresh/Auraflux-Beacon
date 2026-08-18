<template>
  <!-- Main Sidebar Panel Container: Light Theme Surface -->
  <VBox
    tag="aside"
    border="right"
    padding="none"
    class="h-full w-full max-w-xs"
  >
    <VStack gap="none" fullHeight align="stretch">
      <!-- Panel Header Container -->
      <VBox
        padding="md"
        intent="neutral"
        surface="solid"
        border="bottom"
      >
        <VStack gap="sm" align="stretch">
          <!-- Header Title & Counter Badge -->
          <VSectionHeader
            title="Files"
            icon="Folder"
            size="sm"
            weight="bold"
          >
            <template #extra>
              <VBadge intent="neutral" surface="soft" size="sm" class="font-mono">
                {{ files.length }}
              </VBadge>
            </template>
          </VSectionHeader>

          <!-- File Upload Box Component -->
          <VFileUploadBox
            accept=".pdf,.md,.txt,.json"
            multiple
            padding="sm"
            @change="handleFileUpload"
          >
            <template #title>
              Click or drag files here
            </template>
            <template #description>
              PDF, Markdown, TXT, JSON
            </template>
          </VFileUploadBox>
        </VStack>
      </VBox>

      <!-- File Items List Section -->
      <VBox padding="sm" class="flex-1 min-h-0 overflow-y-auto">
        <VStack gap="xs" align="stretch">
          <template v-if="files.length > 0">
            <VCard
              v-for="file in files"
              :key="file.id"
              padding="sm"
              rounded="md"
              border="all"
              :clickable="true"
              :hoverable="true"
              :intent="selectedId === file.id ? 'brand' : 'neutral'"
              :surface="selectedId === file.id ? 'soft' : 'solid'"
              :class="[
                'cursor-pointer transition-all duration-150',
              ]"
              @click="selectFile(file.id)"
            >
              <VStack gap="xs" align="stretch">
                <!-- Top Row: File Name & Status Badge -->
                <VCluster justify="between" align="start" fullWidth gap="xs">
                  <VCluster gap="xs" align="center" class="min-w-0 flex-1">
                    <VIcon
                      :name="getFileIcon(file.fileType)"
                      size="sm"
                      type="solid"
                    />
                    <VTypography
                      tag="span"
                      size="sm"
                      weight="semibold"
                      class="truncate"
                      :title="file.fileName"
                    >
                      {{ file.fileName }}
                    </VTypography>
                  </VCluster>

                  <!-- File Processing Status -->
                  <VBadge
                    v-if="file.status"
                    :intent="getStatusIntent(file.status)"
                    surface="soft"
                    size="xs"
                    class="capitalize shrink-0"
                  >
                    {{ file.status }}
                  </VBadge>
                </VCluster>

                <!-- Bottom Row: Chunk Count & File Size Info -->
                <VBox
                  border="top"
                  padding="none"
                  class="pt-1.5 border-slate-100"
                >
                  <VCluster justify="between" align="center" fullWidth>
                    <VTypography
                      tag="span"
                      size="xs"
                      weight="normal"
                    >
                      {{ file.chunkCount }} Chunks
                    </VTypography>

                    <VTypography
                      tag="span"
                      size="xs"
                      weight="normal"
                      class="font-mono"
                    >
                      {{ file.fileSize }}
                    </VTypography>

                    <VButton
                      intent="danger"
                      surface="solid"
                      size="xs"
                      icon-name="Trash"
                      icon-only
                      title="Delete file"
                      @click.stop="deleteFile(file.id)"
                    />
                  </VCluster>
                </VBox>
              </VStack>
            </VCard>
          </template>

          <!-- Empty State -->
          <VBox v-else padding="lg" class="flex-1">
            <VStack gap="xs" align="center" justify="center" class="text-center h-full">
              <VIcon name="DocumentMagnifyingGlass" size="lg" type="outline" class="opacity-50" />
              <VTypography tag="p" size="xs" weight="normal">
                No files uploaded yet
              </VTypography>
            </VStack>
          </VBox>
        </VStack>
      </VBox>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * MasterFileList Organism / Sidebar Molecule
 * Displays a list of repository files tailored for Light Theme surfaces with file upload capability.
 */
import type { RepositoryFile } from '@/interfaces/repository';
import type { ID } from '@auraflux/design-system/interfaces/core';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';

// Design System Components
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VFileUploadBox from '@auraflux/design-system/components/molecules/forms/VFileUploadBox.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';

export interface MasterFileListProps {
  files: RepositoryFile[];
  selectedId?: ID;
}

withDefaults(defineProps<MasterFileListProps>(), {
  files: () => [],
  selectedId: undefined,
});

const emit = defineEmits<{
  (e: 'delete', id: ID): void;
  (e: 'select', id: ID): void;
  (e: 'upload', files: File[]): void;
}>();

const deleteFile = (id: ID) => {
  emit('delete', id);
};

const selectFile = (id: ID) => {
  emit('select', id);
};

const handleFileUpload = (files: File[]) => {
  emit('upload', files);
};

const getFileIcon = (type?: string) => {
  switch (type) {
    case 'pdf':
      return 'DocumentText';
    case 'code':
      return 'CodeBracket';
    case 'doc':
      return 'DocumentText';
    default:
      return 'Document';
  }
};

const getStatusIntent = (status?: string): IntentToken => {
  switch (status) {
    case 'ready':
      return 'success';
    case 'processing':
      return 'warning';
    case 'error':
      return 'danger';
    default:
      return 'neutral';
  }
};
</script>
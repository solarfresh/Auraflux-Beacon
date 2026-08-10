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

          <!-- File Search Input -->
          <VInput
            v-model="searchQuery"
            placeholder="Filter files..."
            size="sm"
            rounded="md"
          />
        </VStack>
      </VBox>

      <!-- File Items List Section -->
      <VBox padding="sm" class="flex-1 min-h-0 overflow-y-auto">
        <VStack gap="xs" align="stretch">
          <template v-if="filteredFiles.length > 0">
            <VCard
              v-for="file in filteredFiles"
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
                      :name="getFileIcon(file.type)"
                      size="sm"
                      type="solid"
                    />
                    <VTypography
                      tag="span"
                      size="sm"
                      weight="semibold"
                      class="truncate"
                      :title="file.name"
                    >
                      {{ file.name }}
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
                      {{ file.size }}
                    </VTypography>
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
                No matching files found
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
 * Displays a searchable list of repository files tailored for Light Theme surfaces.
 */
import { ref, computed } from 'vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import type { ID } from '@auraflux/shared-core/interfaces/core';
import type { FileItem } from '@/interfaces/repository';

// Design System Components
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

export interface MasterFileListProps {
  files: FileItem[];
  selectedId?: ID;
}

const props = withDefaults(defineProps<MasterFileListProps>(), {
  files: () => [],
  selectedId: undefined,
});

const emit = defineEmits<{
  (e: 'select', id: ID): void;
}>();

const searchQuery = ref('');

const filteredFiles = computed(() => {
  if (!searchQuery.value.trim()) return props.files;
  const q = searchQuery.value.toLowerCase();
  return props.files.filter((f) => f.name.toLowerCase().includes(q));
});

const selectFile = (id: ID) => {
  emit('select', id);
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
<template>
  <VToolbar
    border="none"
    padding="sm"
    :sticky="true"
  >
    <!-- Start Slot: System Title & Count Badge -->
    <template #start>
      <VCluster align="center" gap="xs">
        <VTypography tag="h1" size="md" weight="semibold">
          Repository
        </VTypography>

        <VBadge attention="tertiary" size="sm">
          {{ totalChunks }} Chunks / {{ fileCount }} Files
        </VBadge>
      </VCluster>
    </template>

    <!-- Center Slot: Full-text Search Input -->
    <template #center>
      <VBox padding="none" class="w-80">
        <VInput
          :model-value="searchQuery"
          placeholder="Search questions, tags, or evidence..."
          size="sm"
          rounded="md"
          @update:model-value="emit('update:searchQuery', $event)"
        />
      </VBox>
    </template>

    <!-- End Slot: Filter Controls, Divider & Action Buttons -->
    <template #end>
      <VCluster align="center" gap="xs">
        <VSelect
          :model-value="selectedDomain"
          size="sm"
          rounded="md"
          class="w-44"
          @update:model-value="emit('update:selectedDomain', $event)"
        >
          <option value="">All Domains</option>
          <option
            v-for="domain in domains"
            :key="domain"
            :value="domain"
          >
            {{ domain }}
          </option>
        </VSelect>

        <VDivider orientation="vertical" size="sm" />

        <VButton
          iconName="Funnel"
          iconOnly
          size="sm"
          attention="tertiary"
          title="Advanced Filter"
        />

        <VButton
          iconName="ArrowPath"
          iconOnly
          size="sm"
          attention="tertiary"
          title="Refresh Repository"
        />
      </VCluster>
    </template>
  </VToolbar>
</template>

<script setup lang="ts">
/**
 * RepositoryToolbar Organism
 * Toolbar control header for searching, filtering, and managing repository chunks.
 * Fully refactored using VCluster, VBox, VTypography, VBadge, and Atomic Form controls.
 */
// Design System Components
import VToolbar from '@auraflux/design-system/components/organisms/layout/VToolbar.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

export interface RepositoryToolbarProps {
  searchQuery?: string;
  selectedDomain?: string;
  totalChunks?: number;
  fileCount?: number;
  domains?: string[];
}

const props = withDefaults(defineProps<RepositoryToolbarProps>(), {
  searchQuery: '',
  selectedDomain: '',
  totalChunks: 0,
  fileCount: 0,
  domains: () => [],
});

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:selectedDomain', value: string): void;
  (e: 'refresh'): void;
}>();
</script>
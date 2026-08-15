<template>
  <VCard padding="lg" rounded="xl" border="all" gap="lg" class="shadow-md">
    <!-- Top Header Bar -->
    <VCluster justify="between" align="center" full-width>
      <!-- Left Main Header -->
      <VSectionHeader
        title="Proposition Initializer"
        icon="Sparkles"
        intent="brand"
        size="lg"
      />

      <!-- Right Header Indicators -->
      <VCluster align="center" gap="sm">
        <VBadge
          intent="neutral"
          surface="base"
          size="md"
          class="cursor-pointer"
          @click="goToRepository(projectId)"
        >
          <VCluster align="center" gap="xs">
            <VIcon name="CircleStack" size="xs" />
            <VTypography tag="span" size="xs">
              Repository ({{ fileCount }})
            </VTypography>
          </VCluster>
        </VBadge>
      </VCluster>
    </VCluster>

    <!-- Main Content Area: VBox Flex Layout -->
    <VBox class="flex flex-col lg:flex-row gap-6 items-stretch w-full">
      <!-- Left Column: Problem Statement Input Area (Flex 2/3) -->
      <VBox class="flex-1 lg:w-2/3 flex flex-col justify-between">
        <VFormField label="Initial Proposition Narrative & Dilemma :">
          <template #default="{ id }">
            <VTextarea
              :id="id"
              v-model="propositionText"
              placeholder="E.g., We need to invest 5M within 30 days to procure a new system, but the team is concerned about vendor deployment delays, and finance requires controlling cash flow risks..."
              rows="6"
              size="md"
            />
          </template>
        </VFormField>
      </VBox>

      <!-- Right Column: Initial Reference Info & Context Upload Card (Flex 1/3) -->
      <VBox class="lg:w-1/3 flex flex-col">
        <VCard padding="md" rounded="lg" surface="soft" intent="neutral" gap="md" class="h-full">
          <!-- Card Sub-header -->
          <VCluster justify="between" align="center" full-width>
            <VSectionHeader
              title="Reference"
              icon="PlusSquare"
              iconType="outline"
              size="sm"
            />
          </VCluster>

          <!-- Upload Dropzone -->
          <VFileUploadBox
            padding="sm"
            accept=".pdf,.doc,.docx,.txt"
            :disabled="disabled"
            @change="handleFileChange"
          >
            <template #title>
              <VTypography size="sm" weight="normal" intent="neutral">
                Upload Reference Context
              </VTypography>
            </template>
            <template #description>
              <VTypography tag="span" size="xs" intent="neutral">
                Supports PDF, DOCX, or TXT
              </VTypography>
            </template>
          </VFileUploadBox>
        </VCard>
      </VBox>
    </VBox>

    <!-- Bottom Action Bar -->
    <VCluster justify="end" align="center" gap="md" full-width>
      <!-- Clear Button -->
      <VButton
        intent="neutral"
        surface="base"
        :disabled="disabled"
        @click="handleClear"
      >
        <VTypography tag="span" size="sm">Clear</VTypography>
      </VButton>

      <!-- Main Action Button -->
      <VButton
        intent="brand"
        surface="solid"
        size="md"
        :disabled="disabled || !propositionText.trim()"
        @click="handleSubmit"
      >
        <VCluster align="center" gap="xs">
          <VIcon name="Sparkles" size="sm" />
          <VTypography tag="span" size="sm" weight="medium">
            Start Alignment
          </VTypography>
        </VCluster>
      </VButton>
    </VCluster>
  </VCard>
</template>

<script setup lang="ts">
/**
 * CorePropositionInitializerCard (Organism)
 * The primary entry card component for initiating a core proposition.
 * Handles problem description input, initial context file upload, and alignment trigger.
 */
import { computed, ref } from 'vue';

import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTextarea from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VFileUploadBox from '@auraflux/design-system/components/molecules/forms/VFileUploadBox.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';

import type { ID } from '@auraflux/design-system/interfaces/core';

import { useProjectStore } from '@/stores/project';
import { useRepositoryStore } from '@/stores/repository';
import { useRouter } from 'vue-router';

const projectStore = useProjectStore();
const repositoryStore = useRepositoryStore();
const router = useRouter();

export interface PropositionInitializerCardProps {
  /** Disable interactions across all fields */
  disabled?: boolean;
}

withDefaults(defineProps<PropositionInitializerCardProps>(), {
  disabled: false
});

const emit = defineEmits<{
  /** Triggered when the user submits with context text and optional files */
  (e: 'submit', payload: string): void;
  /** Triggered when clear action is called */
  (e: 'clear'): void;
}>();

// Form State
const propositionText = ref('');
const uploadedFiles = ref<File[]>([]);

const fileCount = computed(() => repositoryStore.files.length);
const projectId = computed(() => projectStore.currentProjectId || '');

const goToRepository = (projectId: ID) => {
  router.push({
    name: 'RepositoryPage',
    params: { projectId: projectId },
  });
};

const handleFileChange = (files: File[]) => {
  projectStore.uploadRepositoryFiles(files)
  uploadedFiles.value = files;
};

const handleClear = () => {
  propositionText.value = '';
  uploadedFiles.value = [];
  emit('clear');
};

const handleSubmit = () => {
  if (!propositionText.value.trim()) return;
  emit('submit', propositionText.value);
};
</script>
<template>
  <VBox tag="section" background="white" class="flex-1 h-full min-w-0 overflow-hidden flex flex-col">

    <template v-if="currentDraft">
      <VBox padding="lg" border="bottom" class="flex-shrink-0">
        <VStack gap="xs">
          <VCluster justify="between" align="center">
            <VTypography tag="h2" size="2xl" weight="bold" color="gray-900">
              {{ isNewEntry ? 'Create New Reflection' : 'Edit Reflection' }}
            </VTypography>

            <VBadge :variant="currentDraft.status === 'committed' ? 'emerald' : 'amber'" size="sm">
              {{ currentDraft.status === 'committed' ? 'Committed' : 'Draft' }}
            </VBadge>
          </VCluster>

          <VCluster gap="xs" align="center">
            <VIcon name="Clock" size="xs" color="gray-400" />
            <VTypography size="xs" color="gray-400">
              Last Updated: {{ new Date(currentDraft.updatedAt).toLocaleString() }}
            </VTypography>
          </VCluster>
        </VStack>
      </VBox>

      <VBox padding="lg" class="flex-1 overflow-y-auto stable-gutter">
        <VStack gap="xl">
          <VReflectionStatus :status="currentDraft.status" />

          <VFormField id="entry-title" label="Entry Title" required>
            <template #default="{ id }">
              <VInput
                :id="id"
                v-model="currentDraft.title"
                :disabled="!isEditable"
                placeholder="e.g., 'Initial Scope Review'..."
              />
            </template>
          </VFormField>

          <VFormField
            id="entry-content"
            label="Reflection Content"
            description="Your thoughts will be saved as a draft unless committed to the log."
          >
            <template #default="{ id }">
              <VTextarea
                :id="id"
                v-model="currentDraft.content"
                :placeholder="editorPlaceholder"
                :disabled="!isEditable"
                class="flex-1 min-h-[400px] font-serif leading-relaxed"
              />
            </template>
          </VFormField>
        </VStack>
      </VBox>

      <VBox padding="md" background="gray-50" border="top">
        <VCluster justify="between" align="center" class="max-w-4xl mx-auto w-full">
          <VCluster gap="sm">
            <VButton
              v-if="!isNewEntry && !isEditing"
              variant="secondary"
              icon-name="PencilSquare"
              @click="$emit('enable-edit')"
            >
              Enable Editing
            </VButton>

            <VButton
              v-else-if="!isNewEntry && isEditing"
              variant="tertiary"
              @click="$emit('cancel-edit')"
            >
              Cancel Edit
            </VButton>
          </VCluster>

          <VCluster gap="md">
            <VButton
              variant="tertiary"
              :disabled="!isEditable"
              @click="$emit('save', 'draft')"
            >
              Save as Draft
            </VButton>
            <VButton
              variant="primary"
              icon-name="CheckCircle"
              :disabled="!isEditable"
              @click="$emit('save', 'commit')"
            >
              Commit Entry
            </VButton>
          </VCluster>
        </VCluster>
      </VBox>
    </template>

    <template v-else>
      <VEmptyState
        icon="DocumentText"
        title="No Entry Selected"
        description="Select an entry from the list or start a new reflection to document your research journey."
      />
    </template>
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReflectionLogEntry } from '@/interfaces/workflow';

// Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

// Molecules
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VReflectionStatus from '@/components/molecules/indicators/VReflectionStatus.vue';
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';

const props = defineProps<{
  currentDraft: ReflectionLogEntry | null;
  originalEntry: ReflectionLogEntry | null;
  isEditing: boolean;
  isNewEntry: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', targetStatus: 'draft' | 'commit'): void;
  (e: 'enable-edit'): void;
  (e: 'cancel-edit'): void;
}>();

const isEditable = computed(() => props.isNewEntry || props.isEditing);
const editorPlaceholder = "Document your decisions, challenges encountered, and insights gained during this phase...";
</script>
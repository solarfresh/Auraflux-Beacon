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
          <FormField id="entry-title" label="Entry Title" required>
            <template #default="{ id }">
              <VInput
                :id="id"
                v-model="currentDraft.title"
                :disabled="!isEditable"
                required
                placeholder="e.g., 'Initial Scope Review'..."
              />
            </template>
          </FormField>

          <FormField
            id="entry-content"
            label="Reflection Content"
            description="Your thoughts will be saved as a draft unless committed."
          >
            <template #default="{ id }">
              <VTextarea
                :id="id"
                v-model="currentDraft.content"
                :placeholder="editorPlaceholder"
                :disabled="!isEditable"
                class="flex-1 min-h-[400px] resize-none font-serif leading-relaxed text-gray-800"
              />
            </template>
          </FormField>
        </VStack>
      </VBox>

      <VBox padding="md" background="gray-50" border="top">
        <VCluster justify="between" align="center" class="max-w-4xl mx-auto w-full">
          <VCluster gap="sm">
            <Button
              v-if="!isNewEntry && !isEditing"
              variant="secondary"
              @click="$emit('enable-edit')"
            >
              <VCluster gap="xs" align="center">
                <VIcon name="PencilSquare" size="sm" />
                <VTypography tag="span">Enable Editing</VTypography>
              </VCluster>
            </Button>

            <Button
              v-else-if="!isNewEntry && isEditing"
              variant="tertiary"
              @click="$emit('cancel-edit')"
            >
              Cancel Edit
            </Button>
          </VCluster>

          <VCluster gap="md">
            <Button
              variant="tertiary"
              :disabled="!isEditable"
              @click="$emit('save', 'draft')"
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              :disabled="!isEditable"
              @click="$emit('save', 'commit')"
            >
              Commit Entry
            </Button>
          </VCluster>
        </VCluster>
      </VBox>
    </template>

    <template v-else>
      <VStack full-height align="center" justify="center" gap="lg" background="gray-50" class="opacity-80">
        <VBox padding="md" background="white" rounded border="all" class="shadow-sm">
          <VIcon name="DocumentText" size="lg" color="gray-300" />
        </VBox>
        <VStack gap="xs" align="center">
          <VTypography size="lg" weight="medium" color="gray-900">No Entry Selected</VTypography>
          <VTypography size="sm" color="gray-500" class="max-w-xs text-center">
            Select an entry from the list or start a new reflection to document your journey.
          </VTypography>
        </VStack>
      </VStack>
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
import Button from '@/components/atoms/actions/Button.vue';

// Molecules
import FormField from '@/components/molecules/actions/FormField.vue';

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
const editorPlaceholder = "Document your decisions, challenges encountered, and insights gained...";
</script>
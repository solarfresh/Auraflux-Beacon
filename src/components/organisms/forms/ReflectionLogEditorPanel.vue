<template>
  <div class="flex-1 h-full bg-white flex flex-col min-w-0">

    <div v-if="currentDraft" class="flex flex-col h-full overflow-hidden">
      <header class="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
        <div class="flex items-center justify-between mb-2">
          <Text tag="h2" size="2xl" weight="bold" color="gray-900">
            {{ isNewEntry ? 'Create New Reflection' : 'Edit Reflection' }}
          </Text>

          <Badge :variant="currentDraft.status === 'committed' ? 'emerald' : 'amber'" size="sm">
            {{ currentDraft.status === 'committed' ? 'Committed' : 'Draft' }}
          </Badge>
        </div>

        <div class="flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <Icon name="Clock" size="xs" />
            <span>Last Updated: {{ new Date(currentDraft.updatedAt).toLocaleString() }}</span>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 space-y-6 stable-gutter">
        <div class="space-y-1.5">
          <Text tag="label" for="entry-title" size="sm" weight="bold" color="gray-700">
            Entry Title
          </Text>
          <Input
            id="entry-title"
            v-model="currentDraft.title"
            :disabled="!isEditable"
            required
            placeholder="e.g., 'Initial Scope Review' or 'Data Feasibility Check'"
            class="w-full"
          />
        </div>

        <div class="flex flex-col min-h-[400px] space-y-1.5 pb-10">
          <Text tag="label" size="sm" weight="bold" color="gray-700">
            Reflection Content
          </Text>
          <Textarea
            v-model="currentDraft.content"
            :placeholder="editorPlaceholder"
            :disabled="!isEditable"
            class="flex-1 resize-none font-serif leading-relaxed text-gray-800"
          />
        </div>
      </div>

      <footer class="p-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
        <div class="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div class="flex gap-2">
            <Button
              v-if="!isNewEntry && !isEditing"
              variant="secondary"
              size="md"
              @click="$emit('enable-edit')"
            >
              <Icon name="PencilSquare" size="sm" class="mr-2" />
              Enable Editing
            </Button>

            <Button
              v-else-if="!isNewEntry && isEditing"
              variant="tertiary"
              size="md"
              @click="handleCancelEditClick"
            >
              Cancel Edit
            </Button>
          </div>

          <div class="flex gap-3">
            <Button
              variant="tertiary"
              size="md"
              :disabled="!isEditable"
              @click="$emit('save', 'draft')"
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              :disabled="!isEditable"
              @click="$emit('save', 'commit')"
            >
              Commit Entry
            </Button>
          </div>
        </div>
      </footer>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-20 text-center bg-gray-50/30">
      <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-gray-100">
        <Icon name="DocumentText" size="lg" color="gray-300" />
      </div>
      <Text tag="p" size="lg" weight="medium" color="gray-900" class="mb-1">No Entry Selected</Text>
      <Text size="sm" color="gray-500" class="max-w-xs">
        Select a historical entry from the list or click "New Entry" to start documenting your research.
      </Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReflectionLogEntry } from '@/interfaces/workflow';

// Atoms
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';

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

function handleCancelEditClick() {
  emit('cancel-edit');
}
</script>

<style scoped>
/* Removed custom scrollbar definitions as they are now handled globally
  via @layer base in your CSS.
*/
</style>
<template>
  <div class="flex flex-col h-full bg-white">
    <header class="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
          <Icon name="PencilSquare" size="md" />
        </div>
        <div class="flex flex-col">
          <Text tag="h2" size="xl" weight="bold" color="gray-900">
            Refine Keyword
          </Text>
          <Text tag="p" size="xs" color="gray-500">
            Precisely define this core concept to guide AI exploration.
          </Text>
        </div>
      </div>
    </header>

    <main class="flex-1 p-6 space-y-6 overflow-y-auto stable-gutter">
      <div class="space-y-1.5">
        <div class="flex justify-between items-center">
          <Text tag="label" for="keyword-input" size="sm" weight="bold" color="gray-700">
            Keyword Text
          </Text>
          <Badge v-if="isTextModified" variant="amber" size="xs" class="animate-pulse">
            Unsaved Changes
          </Badge>
        </div>

        <Textarea
          id="keyword-input"
          v-model="draftText"
          :rows="2"
          placeholder="Enter a precise keyword or phrase..."
          class="w-full text-lg font-medium leading-tight p-4 resize-none"
          :class="{ 'border-red-500 ring-red-100': !draftText.trim() }"
        />
        <p v-if="!draftText.trim()" class="text-xs text-red-500 flex items-center gap-1">
          <Icon name="ExclamationCircle" size="xs" />
          Keyword text cannot be empty.
        </p>
      </div>

      <div
        class="p-4 rounded-2xl border flex items-center justify-between transition-all duration-300"
        :class="statusUI.bgClass"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-white shadow-sm" :class="statusUI.iconColor">
            <Icon :name="statusUI.icon" size="sm" />
          </div>
          <div class="flex flex-col">
            <Text tag="span" size="xs" weight="bold" class="uppercase tracking-widest text-gray-400">
              Current Status
            </Text>
            <Text tag="span" size="sm" weight="bold" :class="statusUI.textColor">
              {{ initialKeyword.entityStatus }}
            </Text>
          </div>
        </div>

        <div v-if="isTextModified" class="text-right">
          <Text tag="p" size="xs" color="amber-600" italic>
            Saving will update the content <br/> and persist the choice below.
          </Text>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
      <div class="flex justify-end items-center gap-3">
        <Button variant="tertiary" size="md" @click="handleCancelAndCheck">
          Cancel
        </Button>

        <template v-if="!isLOCKED">
          <Button
            variant="secondary"
            size="md"
            @click="handleUnifiedSubmit('ON_HOLD')"
            :disabled="!draftText.trim()"
          >
            <Icon name="ArchiveBox" size="sm" class="mr-2" />
            Put On Hold
          </Button>

          <Button
            variant="primary"
            size="md"
            @click="handleUnifiedSubmit('LOCKED')"
            :disabled="!draftText.trim()"
          >
            <Icon name="LockClosed" size="sm" class="mr-2" />
            Lock Keyword
          </Button>
        </template>

        <template v-else>
          <Button
            variant="secondary"
            size="md"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            <Icon name="ArchiveBox" size="sm" class="mr-2" />
            Unlock & Hold
          </Button>

          <Button
            variant="primary"
            size="md"
            @click="handleUnifiedSubmit('LOCKED')"
            :disabled="!isTextModified"
          >
            <Icon name="DocumentCheck" size="sm" class="mr-2" />
            Save Changes
          </Button>
        </template>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';
import { useInitiativeStore } from '@/stores/initiation';

// Atoms
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';

/**
 * SingleKeywordDetailEditor: Refines a specific keyword's text and status.
 * Handles the logic between LOCKED, ON_HOLD, and DRAFT states.
 */
const props = defineProps<{
  keywordIndex: number;
  initialKeyword: ProcessedKeyword;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();

// --- Local State ---
const draftText = ref(props.initialKeyword.label);

watch(() => props.initialKeyword.label, (newVal) => {
  draftText.value = newVal;
});

// --- Computed Logic ---

const isLOCKED = computed(() => props.initialKeyword.entityStatus === 'LOCKED');
const isTextModified = computed(() => draftText.value.trim() !== props.initialKeyword.label);

/**
 * Maps EntityStatus to a visual configuration object.
 * * English Documentation: Provides UI meta-data for consistent feedback.
 */
const statusUI = computed(() => {
  const status = props.initialKeyword.entityStatus;
  const config = {
    LOCKED: {
      bgClass: 'bg-indigo-50 border-indigo-100',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600',
      icon: 'LockClosed'
    },
    AI_EXTRACTED: {
      bgClass: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      icon: 'Sparkles'
    },
    ON_HOLD: {
      bgClass: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-500',
      iconColor: 'text-gray-400',
      icon: 'ArchiveBox'
    },
    USER_DRAFT: {
      bgClass: 'bg-white border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600',
      icon: 'PencilSquare'
    }
  };
  return config[status as keyof typeof config] || config.USER_DRAFT;
});

// --- Actions ---

/**
 * Commits the keyword change to the store.
 * * This unified handler manages both text updates and status transitions.
 */
async function handleUnifiedSubmit(targetStatus: EntityStatus) {
  const text = draftText.value.trim();
  if (!text) return;

  // Persistence via Store
  await initiativeStore.createOrUpdateTopicKeywords(
    props.initialKeyword.id,
    text,
    targetStatus
  );

  emit('close-modal');
}

/**
 * Checks for unsaved changes before closing.
 */
function handleCancelAndCheck() {
  if (isTextModified.value) {
    if (window.confirm('Discard unsaved text changes?')) {
      emit('close-modal');
    }
  } else {
    emit('close-modal');
  }
}
</script>
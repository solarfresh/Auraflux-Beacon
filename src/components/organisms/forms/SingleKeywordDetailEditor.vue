<template>
  <Box tag="section" background="white" class="flex flex-col h-full overflow-hidden">

    <Box padding="lg" border="bottom" class="flex-shrink-0">
      <Cluster gap="md" align="center">
        <Box padding="sm" background="indigo-50" rounded="xl" class="text-indigo-600 shadow-sm">
          <Icon name="PencilSquare" size="md" />
        </Box>
        <Stack gap="none">
          <Text tag="h2" size="xl" weight="bold" color="gray-900">
            Refine Keyword
          </Text>
          <Text size="xs" color="gray-500">
            Precisely define this core concept to guide AI exploration.
          </Text>
        </Stack>
      </Cluster>
    </Box>

    <Box tag="main" padding="lg" class="flex-1 overflow-y-auto stable-gutter">
      <Stack gap="xl">

        <FormField id="keyword-input" label="Keyword Text">
          <template #hint>
            <Badge v-if="isTextModified" variant="amber" size="xs" class="animate-pulse">
              Unsaved Changes
            </Badge>
          </template>

          <template #default="{ id }">
            <Stack gap="xs">
              <Textarea
                :id="id"
                v-model="draftText"
                :rows="2"
                placeholder="Enter a precise keyword..."
                class="w-full text-lg font-medium p-4 resize-none"
                :class="{ 'border-red-500 ring-red-100': !draftText.trim() }"
              />
              <Cluster v-if="!draftText.trim()" gap="xs" align="center" class="text-red-500">
                <Icon name="ExclamationCircle" size="xs" />
                <Text size="xs">Keyword text cannot be empty.</Text>
              </Cluster>
            </Stack>
          </template>
        </FormField>

        <Box
          padding="md"
          rounded="xl"
          border="all"
          :class="[statusUI.bgClass, 'transition-all duration-300']"
        >
          <Cluster justify="between" align="center" full-width>
            <Cluster gap="md" align="center">
              <Box padding="sm" background="white" rounded="md" border="all" :class="statusUI.iconColor" class="shadow-sm">
                <Icon :name="statusUI.icon" size="sm" />
              </Box>
              <Stack gap="none">
                <Text size="xs" weight="bold" color="gray-400" class="uppercase tracking-widest">
                  Current Status
                </Text>
                <Text size="sm" weight="bold" :class="statusUI.textColor">
                  {{ initialKeyword.entityStatus }}
                </Text>
              </Stack>
            </Cluster>

            <Box v-if="isTextModified" padding="none" class="text-right">
              <Text size="xs" color="amber-600" italic class="leading-tight">
                Saving will update content <br/> and persist the choice below.
              </Text>
            </Box>
          </Cluster>
        </Box>
      </Stack>
    </Box>

    <Box padding="md" background="gray-50" border="top" class="flex-shrink-0">
      <Cluster justify="end" gap="md">
        <Button variant="tertiary" @click="handleCancelAndCheck">
          Cancel
        </Button>

        <template v-if="!isLOCKED">
          <Button
            variant="secondary"
            icon-name="ArchiveBox"
            :disabled="!draftText.trim()"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Put On Hold
          </Button>

          <Button
            variant="primary"
            icon-name="LockClosed"
            :disabled="!draftText.trim()"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Lock Keyword
          </Button>
        </template>

        <template v-else>
          <Button
            variant="secondary"
            icon-name="ArchiveBox"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            Unlock & Hold
          </Button>

          <Button
            variant="primary"
            icon-name="DocumentCheck"
            :disabled="!isTextModified"
            @click="handleUnifiedSubmit('LOCKED')"
          >
            Save Changes
          </Button>
        </template>
      </Cluster>
    </Box>
  </Box>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';
import { useInitiativeStore } from '@/stores/initiation';

// Atoms & Molecules
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Textarea from '@/components/atoms/forms/Textarea.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';
import FormField from '@/components/molecules/actions/FormField.vue';

const props = defineProps<{
  keywordIndex: number;
  initialKeyword: ProcessedKeyword;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();
const draftText = ref(props.initialKeyword.label);

// Keep draft in sync if external data changes
watch(() => props.initialKeyword.label, (newVal) => {
  draftText.value = newVal;
});

const isLOCKED = computed(() => props.initialKeyword.entityStatus === 'LOCKED');
const isTextModified = computed(() => draftText.value.trim() !== props.initialKeyword.label);

/**
 * UI Configuration Mapping
 * Translates backend entity states into cohesive UI themes.
 */
const statusUI = computed(() => {
  const status = props.initialKeyword.entityStatus;
  const config = {
    LOCKED: {
      bgClass: 'bg-indigo-50 border-indigo-100',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600',
      icon: 'LockClosed' as const
    },
    AI_EXTRACTED: {
      bgClass: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      icon: 'Sparkles' as const
    },
    ON_HOLD: {
      bgClass: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-500',
      iconColor: 'text-gray-400',
      icon: 'ArchiveBox' as const
    },
    USER_DRAFT: {
      bgClass: 'bg-white border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600',
      icon: 'PencilSquare' as const
    }
  };
  return config[status as keyof typeof config] || config.USER_DRAFT;
});

/**
 * Persists the refined keyword and its new status.
 */
async function handleUnifiedSubmit(targetStatus: EntityStatus) {
  const text = draftText.value.trim();
  if (!text) return;
  await initiativeStore.createOrUpdateTopicKeywords(props.initialKeyword.id, text, targetStatus);
  emit('close-modal');
}

/**
 * Safety check for unsaved state before closing the editor.
 */
function handleCancelAndCheck() {
  if (isTextModified.value && !window.confirm('Discard unsaved text changes?')) return;
  emit('close-modal');
}
</script>
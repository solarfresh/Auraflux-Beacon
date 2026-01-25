<template>
  <Box
    tag="div"
    padding="sm"
    rounded
    border="all"
    clickable
    v-bind="$attrs"
    :background="styles.bgColor"
    :class="[
      'transition-all duration-150',
      styles.borderColor
    ]"
    @click="handleEditRequest"
  >
    <Cluster justify="between" align="center" full-width>
      <Cluster gap="md" align="start">
        <VIcon
          :name="styles.icon"
          type="outline"
          size="sm"
          :color="styles.iconColor"
          class="mt-1 flex-shrink-0"
        />

        <Stack gap="none">
          <VTypography tag="span" size="base" weight="medium" :color="styles.iconColor">
            {{ keyword.label }}
          </VTypography>
          <VTypography tag="span" size="xs" :color="styles.iconColor" class="opacity-80">
            {{ styles.secondaryVTypography }}
          </VTypography>
        </Stack>
      </Cluster>

      <Button
        variant="ghost"
        icon-only
        :icon-name="styles.actionIcon"
        size="sm"
        :aria-label="`Edit keyword ${keyword.label}`"
        class="flex-shrink-0"
      />
    </Cluster>
  </Box>
</template>

<script setup lang="ts">
/**
 * KeywordListItem (Molecule)
 * Refactored to use 100% Layout Atoms.
 * No external margins; no raw HTML tags.
 */
import { computed } from 'vue';
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import Button from '@/components/atoms/actions/Button.vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedKeyword } from '@/interfaces/initiation';

// Explicitly disable inheritance to control the binding point in the template
defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  keyword: ProcessedKeyword;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'edit-request', payload: { index: number, keyword: ProcessedKeyword }): void;
}>();

/** * Refactored Style Mapping
 * Now maps directly to Atom Props (bgColor) and Tailwind tokens.
 */
const styles = computed(() => {
  switch (props.keyword.entityStatus as EntityStatus) {
    case 'LOCKED':
      return {
          bgColor: 'indigo-50' as const,
          borderColor: 'border-indigo-200 hover:border-indigo-300',
          icon: 'LockClosed',
          iconColor: 'indigo-600',
          secondaryVTypography: 'LOCKED (Committed)',
          actionIcon: 'ChevronRight',
      };
    case 'AI_EXTRACTED':
      return {
          bgColor: 'gray-50' as const, // Standardized to system palette
          borderColor: 'border-yellow-200 hover:border-yellow-300',
          icon: 'Sparkles',
          iconColor: 'yellow-600',
          secondaryVTypography: 'AI Capture (Needs Review)',
          actionIcon: 'ExclamationCircle',
      };
    case 'ON_HOLD':
      return {
          bgColor: 'gray-50' as const,
          borderColor: 'border-gray-300 hover:border-gray-400',
          icon: 'ArchiveBox',
          iconColor: 'gray-500',
          secondaryVTypography: 'ON HOLD (Excluded)',
          actionIcon: 'ArrowPath',
      };
    case 'USER_DRAFT':
    default:
      return {
          bgColor: 'white' as const,
          borderColor: 'border-gray-200 hover:border-gray-300',
          icon: 'ClipboardDocumentList',
          iconColor: 'gray-600',
          secondaryVTypography: 'User Draft (Pending Lock)',
          actionIcon: 'PencilSquare',
      };
  }
});

function handleEditRequest() {
  emit('edit-request', {
    index: props.index,
    keyword: props.keyword,
  });
}
</script>
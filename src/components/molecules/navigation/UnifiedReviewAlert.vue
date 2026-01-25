<template>
  <div
    v-if="totalUnreviewedCount > 0"
    class="p-4 rounded-xl border border-indigo-200 bg-indigo-50/80 backdrop-blur-sm cursor-pointer hover:bg-indigo-100 transition shadow-sm group"
    @click="handleAlertClick"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <VIcon
          name="ClipboardDocumentList"
          size="md"
          color="indigo-600"
        />
        <VTypography tag="span" size="sm" weight="bold" color="indigo-900">
          Review Needed: {{ totalUnreviewedCount }} items in Keywords & Scope
        </VTypography>
      </div>

      <VIcon
        name="ChevronRight"
        size="xs"
        color="indigo-600"
        class="transform transition-transform group-hover:translate-x-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import type { ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';

const props = defineProps<{
  keywords: ProcessedKeyword[];
  scope: ProcessedScope[];
}>();

const emit = defineEmits<{
  /** * Emitted when the alert is clicked.
   * Navigates to the first section that needs attention.
   */
  (e: 'scroll-to-review', firstSection: 'keyword' | 'scope'): void;
}>();

// --- Computed Logic (Synced with ManagementSections) ---

const unreviewedKeywordCount = computed(() => {
  return props.keywords.filter(k =>
    ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus)
  ).length;
});

const unreviewedScopeCount = computed(() => {
  return props.scope.filter(s =>
    ['AI_EXTRACTED', 'USER_DRAFT'].includes(s.entityStatus)
  ).length;
});

const totalUnreviewedCount = computed(() => {
  return unreviewedKeywordCount.value + unreviewedScopeCount.value;
});

// --- Methods ---

const handleAlertClick = () => {
  const firstSection = unreviewedKeywordCount.value > 0 ? 'keyword' : 'scope';
  emit('scroll-to-review', firstSection);
};
</script>
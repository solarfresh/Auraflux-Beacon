<template>
  <div
    v-if="totalUnreviewedCount > 0"
    class="p-4 rounded-lg border border-indigo-300 bg-indigo-50 cursor-pointer hover:bg-indigo-100 transition shadow-sm"
    @click="handleAlertClick"
  >
    <div class="flex items-center justify-between">

      <div class="flex items-center space-x-3">
        <Icon name="ClipboardDocumentList" type="outline" size="md" color="indigo-600" />
        <Text tag="span" size="base" weight="medium" color="indigo-700">
          You have {{ totalUnreviewedCount }} items to review (Keywords and Scope).
        </Text>
      </div>

      <Icon name="ChevronRight" type="outline" size="sm" color="indigo-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';

// ----------------------------------------------------------------------
// --- Props & Emits ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** Full list of keywords, used to calculate unreviewed keyword count. */
  keywords: ProcessedKeyword[];
  /** Full list of scope elements, used to calculate unreviewed scope count. */
  scope: ProcessedScope[];
}>();

const emit = defineEmits<{
  /** Emitted when the alert is clicked. Contains the first section that needs attention ('keyword' or 'scope'). */
  (e: 'scroll-to-review', firstSection: 'keyword' | 'scope'): void;
}>();


// ----------------------------------------------------------------------
// --- Computed Properties ---
// ----------------------------------------------------------------------

/** Calculates the number of keywords that need user attention (AI_EXTRACTED or USER_DRAFT). */
const unreviewedKeywordCount = computed(() => {
  return props.keywords.filter(k => k.entityStatus === 'AI_EXTRACTED' || k.entityStatus === 'USER_DRAFT').length;
});

/** Calculates the number of scope elements that need user attention (DRAFT/SUGGESTED). */
const unreviewedScopeCount = computed(() => {
  // NOTE: Assuming DRAFT status covers all unreviewed scope items.
  return props.scope.filter(s => s.entityStatus === 'AI_EXTRACTED' || s.entityStatus === 'USER_DRAFT').length;
});

/** Total count of all items requiring user review across all sections. */
const totalUnreviewedCount = computed(() => {
  return unreviewedKeywordCount.value + unreviewedScopeCount.value;
});


// ----------------------------------------------------------------------
// --- Methods ---
// ----------------------------------------------------------------------

/** * Determines which section should be scrolled to first based on the current review queue.
 * Prioritizes the Keywords section if both have items.
 */
const handleAlertClick = () => {
    let firstSection: 'keyword' | 'scope';

    if (unreviewedKeywordCount.value > 0) {
        firstSection = 'keyword';
    } else if (unreviewedScopeCount.value > 0) {
        firstSection = 'scope';
    } else {
        // Should not happen if v-if="totalUnreviewedCount > 0" is working,
        // but default to keyword for safety.
        return;
    }

    emit('scroll-to-review', firstSection);
};
</script>
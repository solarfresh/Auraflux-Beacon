<template>
  <BaseSectionLayout title="Core Keywords & Elements">
    <template #header-actions>
      <VButton
        variant="ghost"
        size="xs"
        iconOnly
        iconName="Plus"
        @click="emit('add-request')"
      />
    </template>

    <template #stats>
      <div class="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded text-indigo-700">
        <VIcon name="LockClosed" size="xs" color="indigo-500" />
        <VTypography tag="span" size="xs" weight="bold">
          {{ lockedCount }}/{{ keywords.length }} Locked
        </VTypography>
      </div>

      <VButton
        v-if="unreviewedCount > 0"
        variant="secondary"
        size="xs"
        @click="isReviewGroupOpen = true"
        class="!bg-amber-50 !border-amber-200 !text-amber-700 hover:!bg-amber-100"
      >
        <VIcon name="ExclamationCircle" size="xs" color="amber-500" class="mr-1" />
        {{ unreviewedCount }} To Review
      </VButton>
    </template>

    <template #content>

      <SectionGroup title="Locked Core" variant="indigo">
        <KeywordListItem
          v-for="(kw, idx) in getGroupData('LOCKED')"
          :key="kw.id"
          :keyword="kw"
          :index="idx"
          @edit-request="handleKeywordEdit"
        />
        <template #footer>
          <VButton
            v-if="lockedCount > LIMITS.LOCKED && !isLockedFullView"
            variant="ghost"
            size="xs"
            @click="isLockedFullView = true"
            class="self-start"
          >
            View All ({{ lockedCount - LIMITS.LOCKED }} more)
          </VButton>
        </template>
      </SectionGroup>

      <SectionGroup title="To Review / Draft" variant="amber" collapsible>
        <KeywordListItem
          v-for="(kw, idx) in getGroupData('REVIEW')"
          :key="kw.id"
          :keyword="kw"
          :index="idx"
          @edit-request="handleKeywordEdit"
        />
      </SectionGroup>

      <SectionGroup
        title="On Hold"
        :count="onHoldCount"
        variant="gray"
        collapsible
        default-closed
      >
        <KeywordListItem
          v-for="(kw, idx) in getGroupData('ON_HOLD')"
          :key="kw.id"
          :keyword="kw"
          :index="idx"
          @edit-request="handleKeywordEdit"
        />
        <template #footer>
          <VButton
            v-if="onHoldCount > LIMITS.ON_HOLD && !isOnHoldFullView"
            variant="ghost"
            size="xs"
            @click="isOnHoldFullView = true"
            class="self-start"
          >
            View All ({{ onHoldCount - LIMITS.ON_HOLD }} more)
          </VButton>
        </template>
      </SectionGroup>

    </template>
  </BaseSectionLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ProcessedKeyword } from '@/interfaces/initiation';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import SectionGroup from '@/components/molecules/navigation/SectionGroup.vue';
import KeywordListItem from '@/components/molecules/list-items/KeywordListItem.vue';
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';

const props = defineProps<{
  keywords: ProcessedKeyword[];
}>();

const emit = defineEmits<{
  (e: 'add-request'): void;
  (e: 'edit-request', payload: { index: number, keyword: ProcessedKeyword }): void;
}>();

// --- Configuration ---
const LIMITS = { LOCKED: 5, ON_HOLD: 3 };

// --- UI State ---
const isLockedFullView = ref(false);
const isReviewGroupOpen = ref(true);
const isOnHoldFullView = ref(false);

// --- Computed Stats ---
const lockedCount = computed(() => props.keywords.filter(k => k.entityStatus === 'LOCKED').length);
const unreviewedCount = computed(() => props.keywords.filter(k => ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus)).length);
const onHoldCount = computed(() => props.keywords.filter(k => k.entityStatus === 'ON_HOLD').length);

/**
 * Orchestrates data display logic: filtering by status and applying view limits.
 */
const getGroupData = (group: 'LOCKED' | 'REVIEW' | 'ON_HOLD') => {
  const filtered = props.keywords.filter(k => {
    if (group === 'LOCKED') return k.entityStatus === 'LOCKED';
    if (group === 'REVIEW') return ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus);
    return k.entityStatus === 'ON_HOLD';
  });

  if (group === 'LOCKED' && !isLockedFullView.value) return filtered.slice(0, LIMITS.LOCKED);
  if (group === 'ON_HOLD' && !isOnHoldFullView.value) return filtered.slice(0, LIMITS.ON_HOLD);
  return filtered;
};

const handleKeywordEdit = (payload: { index: number, keyword: ProcessedKeyword }) => {
  emit('edit-request', payload);
};
</script>
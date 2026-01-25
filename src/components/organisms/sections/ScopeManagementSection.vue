<template>
  <BaseSectionLayout title="Research Scope & Boundaries">
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
          {{ lockedCount }}/{{ scope.length }} Locked
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

      <SectionGroup title="Core Boundaries" variant="indigo">
        <ScopeListItem
          v-for="(item, idx) in getGroupData('LOCKED')"
          :key="item.id"
          :scope-element="item"
          :index="idx"
          @edit-request="handleScopeEdit"
        />
      </SectionGroup>

      <SectionGroup
        title="To Review / Draft"
        variant="amber"
        collapsible
        v-model:open="isReviewGroupOpen"
      >
        <ScopeListItem
          v-for="(item, idx) in getGroupData('REVIEW')"
          :key="item.id"
          :scope-element="item"
          :index="idx"
          @edit-request="handleScopeEdit"
        />
      </SectionGroup>

      <SectionGroup
        title="On Hold"
        :count="onHoldCount"
        variant="gray"
        collapsible
        default-closed
      >
        <ScopeListItem
          v-for="(item, idx) in getGroupData('ON_HOLD')"
          :key="item.id"
          :scope-element="item"
          :index="idx"
          @edit-request="handleScopeEdit"
        />
        <template #footer>
          <VButton
            v-if="onHoldCount > LIMITS.ON_HOLD && !isViewingAll"
            variant="ghost"
            size="xs"
            @click="isViewingAll = true"
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
import type { ProcessedScope } from '@/interfaces/initiation';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import SectionGroup from '@/components/molecules/navigation/SectionGroup.vue';
import ScopeListItem from '@/components/molecules/list-items/ScopeListItem.vue';
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';

const props = defineProps<{
  scope: ProcessedScope[];
}>();

const emit = defineEmits<{
  (e: 'add-request'): void;
  (e: 'edit-request', payload: { index: number, scope: ProcessedScope }): void;
}>();

// --- Configuration ---
const LIMITS = { ON_HOLD: 3 };

// --- UI State ---
const isReviewGroupOpen = ref(true);
const isViewingAll = ref(false);

// --- Computed Stats ---
const lockedCount = computed(() => props.scope.filter(k => k.entityStatus === 'LOCKED').length);
const unreviewedCount = computed(() => props.scope.filter(k => ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus)).length);
const onHoldCount = computed(() => props.scope.filter(k => k.entityStatus === 'ON_HOLD').length);

/**
 * Orchestrates data display logic: filtering by status and applying view limits.
 */
const getGroupData = (group: 'LOCKED' | 'REVIEW' | 'ON_HOLD') => {
  const filtered = props.scope.filter(k => {
    if (group === 'LOCKED') return k.entityStatus === 'LOCKED';
    if (group === 'REVIEW') return ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus);
    return k.entityStatus === 'ON_HOLD';
  });

  if (group === 'ON_HOLD' && !isViewingAll.value) return filtered.slice(0, LIMITS.ON_HOLD);
  return filtered;
};

const handleScopeEdit = (payload: { index: number, scope: ProcessedScope }) => {
  emit('edit-request', payload);
};
</script>
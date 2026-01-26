<template>
  <BaseSectionLayout title="Core Keywords & Elements">
    <template #header-actions>
      <VButton
        variant="ghost"
        size="xs"
        icon-only
        icon-name="Plus"
        @click="emit('add-request')"
      />
    </template>

    <template #stats>
      <VCluster gap="xs" align="center">
        <VBox
          background="indigo-50"
          padding="xs"
          rounded="md"
          class="text-indigo-700"
        >
          <VCluster gap="xs" align="center">
            <VIcon name="LockClosed" size="xs" class="text-indigo-500" />
            <VTypography tag="span" size="xs" weight="bold">
              {{ lockedCount }}/{{ keywords.length }} Locked
            </VTypography>
          </VCluster>
        </VBox>

        <VButton
          v-if="unreviewedCount > 0"
          variant="secondary"
          size="xs"
          @click="isReviewGroupOpen = true"
          class="!bg-amber-50 !border-amber-200 !text-amber-700 hover:!bg-amber-100"
        >
          <VCluster gap="xs" align="center">
            <VIcon name="ExclamationCircle" size="xs" class="text-amber-500 mr-1" />
            {{ unreviewedCount }} To Review
          </VCluster>
        </VButton>
      </VCluster>
    </template>

    <template #content>
      <VStack gap="md">

        <VNavGroup title="Locked Core" variant="indigo">
          <VStack gap="xs">
            <VTagListItem
              v-for="(kw, idx) in getGroupData('LOCKED')"
              :key="kw.id"
              :keyword="kw"
              :index="idx"
              @edit-request="handleKeywordEdit"
            />
          </VStack>

          <template #footer>
            <VBox v-if="lockedCount > LIMITS.LOCKED && !isLockedFullView" class="pt-1">
              <VButton
                variant="ghost"
                size="xs"
                @click="isLockedFullView = true"
              >
                View All ({{ lockedCount - LIMITS.LOCKED }} more)
              </VButton>
            </VBox>
          </template>
        </VNavGroup>

        <VNavGroup title="To Review / Draft" variant="amber" collapsible>
          <VStack gap="xs">
            <VTagListItem
              v-for="(kw, idx) in getGroupData('REVIEW')"
              :key="kw.id"
              :keyword="kw"
              :index="idx"
              @edit-request="handleKeywordEdit"
            />
          </VStack>
        </VNavGroup>

        <VNavGroup
          title="On Hold"
          :count="onHoldCount"
          variant="gray"
          collapsible
          default-closed
        >
          <VStack gap="xs">
            <VTagListItem
              v-for="(kw, idx) in getGroupData('ON_HOLD')"
              :key="kw.id"
              :keyword="kw"
              :index="idx"
              @edit-request="handleKeywordEdit"
            />
          </VStack>

          <template #footer>
            <VBox v-if="onHoldCount > LIMITS.ON_HOLD && !isOnHoldFullView" class="pt-1">
              <VButton
                variant="ghost"
                size="xs"
                @click="isOnHoldFullView = true"
              >
                View All ({{ onHoldCount - LIMITS.ON_HOLD }} more)
              </VButton>
            </VBox>
          </template>
        </VNavGroup>

      </VStack>
    </template>
  </BaseSectionLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
// Indicators & Buttons
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
// Nav Molecules
import VNavGroup from '@/components/molecules/navs/VNavGroup.vue';
import VTagListItem from '@/components/molecules/navs/VTagListItem.vue';
// Organisms
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';

import type { ProcessedKeyword } from '@/interfaces/initiation';

const props = defineProps<{
  keywords: ProcessedKeyword[];
}>();

const emit = defineEmits<{
  (e: 'add-request'): void;
  (e: 'edit-request', payload: { index: number, keyword: ProcessedKeyword }): void;
}>();

// --- Configuration ---
/** Spacing and view limit constants */
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
 * Filter and slice keyword data based on status and expansion state.
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
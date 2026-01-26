<template>
  <BaseSectionLayout title="Research Scope & Boundaries">
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
        >
          <VCluster gap="xs" align="center">
            <VIcon name="LockClosed" size="xs" class="text-indigo-500" />
            <VTypography tag="span" size="xs" weight="bold" class="text-indigo-700">
              {{ lockedCount }}/{{ scope.length }} Locked
            </VTypography>
          </VCluster>
        </VBox>

        <VButton
          v-if="unreviewedCount > 0"
          variant="secondary"
          size="xs"
          @click="openReviewGroup"
          class="!bg-amber-50 !border-amber-200 !text-amber-700 hover:!bg-amber-100"
        >
          <VCluster gap="xs" align="center">
            <VIcon name="ExclamationCircle" size="xs" class="text-amber-500" />
            <span>{{ unreviewedCount }} To Review</span>
          </VCluster>
        </VButton>
      </VCluster>
    </template>

    <template #content>
      <VStack gap="md">

        <VNavGroup title="Core Boundaries" variant="indigo">
          <VStack gap="xs">
            <VActionListItem
              v-for="(item, idx) in getGroupData('LOCKED')"
              :key="item.id"
              :scope-element="item"
              :index="idx"
              @edit-request="handleScopeEdit"
            />
          </VStack>
        </VNavGroup>

        <VNavGroup
          title="To Review / Draft"
          variant="amber"
          collapsible
          v-model:open="isReviewGroupOpen"
          ref="reviewGroupRefEl"
        >
          <VStack gap="xs">
            <VActionListItem
              v-for="(item, idx) in getGroupData('REVIEW')"
              :key="item.id"
              :scope-element="item"
              :index="idx"
              @edit-request="handleScopeEdit"
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
            <VActionListItem
              v-for="(item, idx) in getGroupData('ON_HOLD')"
              :key="item.id"
              :scope-element="item"
              :index="idx"
              @edit-request="handleScopeEdit"
            />
          </VStack>

          <template #footer>
            <VBox v-if="onHoldCount > LIMITS.ON_HOLD && !isViewingAll" padding="xs" class="pl-0 pb-0">
              <VButton
                variant="ghost"
                size="xs"
                @click="isViewingAll = true"
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
import { computed, ref, nextTick } from 'vue';

// Layout Atoms
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';

// Indicator & Action Atoms
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

// Navigation Molecules
import VNavGroup from '@/components/molecules/navs/VNavGroup.vue';
import VActionListItem from '@/components/molecules/navs/VActionListItem.vue';

// Section Organism
import BaseSectionLayout from '@/components/organisms/sections/BaseSectionLayout.vue';

import type { ProcessedScope } from '@/interfaces/initiation';

const props = defineProps<{
  scope: ProcessedScope[];
}>();

const emit = defineEmits<{
  (e: 'add-request'): void;
  (e: 'edit-request', payload: { index: number, scope: ProcessedScope }): void;
}>();

// --- Configuration ---
/** Threshold for truncated lists */
const LIMITS = { ON_HOLD: 3 };

// --- UI State ---
const isReviewGroupOpen = ref(true);
const isViewingAll = ref(false);

// --- Computed Stats ---
const lockedCount = computed(() => props.scope.filter(k => k.entityStatus === 'LOCKED').length);
const unreviewedCount = computed(() => props.scope.filter(k => ['AI_EXTRACTED', 'USER_DRAFT'].includes(k.entityStatus)).length);
const onHoldCount = computed(() => props.scope.filter(k => k.entityStatus === 'ON_HOLD').length);

const reviewGroupRefEl = ref<InstanceType<typeof VNavGroup> | null>(null);

/**
 * Filters scope elements based on their processing status and handles view limits.
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


const openReviewGroup = async () => {
  isReviewGroupOpen.value = true;

  // Wait for the next DOM update cycle to ensure the element is rendered
  await nextTick();

  // Access the DOM element via the ref's .value property and call scrollIntoView
  reviewGroupRefEl.value?.$el?.scrollIntoView({
    behavior: 'smooth', // Optional: for smooth scrolling animation
    block: 'start'      // Optional: align the top of the element to the top of the viewport
  });
}
</script>
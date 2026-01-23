<template>
  <BaseSectionLayout title="Core Keywords & Elements">
    <template #header-actions>
      <Button
        variant="ghost"
        size="xs"
        iconOnly
        iconName="Plus"
        @click="emit('add-request')"
      />
    </template>

    <template #stats>
      <div class="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded text-indigo-700">
        <Icon name="LockClosed" size="xs" color="indigo-500" />
        <Text tag="span" size="xs" weight="bold">
          {{ lockedCount }}/{{ keywords.length }} Locked
        </Text>
      </div>

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
          <Button
            v-if="lockedCount > LIMITS.LOCKED && !isLockedFullView"
            variant="ghost"
            size="xs"
            @click="isLockedFullView = true"
            class="self-start"
          >
            View All ({{ lockedCount - LIMITS.LOCKED }} more)
          </Button>
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
          <Button
            v-if="onHoldCount > LIMITS.ON_HOLD && !isOnHoldFullView"
            variant="ghost"
            size="xs"
            @click="isOnHoldFullView = true"
            class="self-start"
          >
            View All ({{ onHoldCount - LIMITS.ON_HOLD }} more)
          </Button>
        </template>
      </SectionGroup>

    </template>
  </BaseSectionLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ProcessedKeyword } from '@/interfaces/initiation';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
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
const isOnHoldFullView = ref(false);

// --- Computed Stats ---
const lockedCount = computed(() => props.keywords.filter(k => k.entityStatus === 'LOCKED').length);
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
<template>
  <div class="space-y-3">

    <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
      <Text tag="span" size="lg" weight="semibold" color="gray-800">Core Keywords & Elements</Text>

      <Button variant="tertiary" size="sm" @click="emit('add-request')">
        <Icon name="Plus" type="outline" size="sm" color="gray-600" />
      </Button>
    </Text>

    <div class="flex items-center space-x-4">
      <Text tag="span" size="sm" weight="medium" color="indigo-600">
          <Icon name="LockClosed" type="solid" size="xs" class="mr-1" />
          {{ lockedKeywordsCount }}/{{ props.keywords.length }} Locked
      </Text>

      <Text v-if="unreviewedKeywordsCount > 0" tag="span" size="sm" weight="bold" color="yellow-600"
            class="px-2 py-0.5 rounded-full bg-yellow-100 cursor-pointer hover:bg-yellow-200"
            @click="toggleGroup('REVIEW')">
          <Icon name="ExclamationCircle" type="solid" size="xs" class="mr-1" />
          {{ unreviewedKeywordsCount }} To Review
      </Text>
    </div>

    <div class="space-y-4">

      <div v-if="filteredKeywords('LOCKED').length > 0">
        <Text tag="h4" size="sm" weight="semibold" color="indigo-700" class="border-b pb-1">Locked Core</Text>
        <ul class="space-y-2 pt-1">
          <KeywordListItem
              v-for="(keyword, index) in filteredKeywords('LOCKED')"
              :key="index"
              :keyword="keyword"
              :index="index"
              @edit-request="handleKeywordEdit"
          />
        </ul>
      </div>

      <div v-if="filteredKeywords('REVIEW').length > 0">
        <div class="flex items-center justify-between cursor-pointer border-b pb-1" @click="toggleGroup('REVIEW')">
          <Text tag="h4" size="sm" weight="semibold" :color="unreviewedKeywordsCount > 0 ? 'yellow-700' : 'gray-700'">
            To Review / Draft
          </Text>
          <Icon :name="isReviewGroupOpen ? 'ChevronUp' : 'ChevronDown'" type="outline" size="sm" color="gray-600" />
        </div>
        <ul v-if="isReviewGroupOpen" class="space-y-2 pt-1">
           <KeywordListItem
              v-for="(keyword, index) in filteredKeywords('REVIEW')"
              :key="index"
              :keyword="keyword"
              :index="index"
              @edit-request="handleKeywordEdit"
          />
        </ul>
      </div>

      <div v-if="onHoldKeywordsCount > 0">
        <div class="flex items-center justify-between cursor-pointer border-b pb-1" @click="toggleGroup('HOLD')">
          <Text tag="h4" size="sm" weight="semibold" color="gray-500">
            On Hold / Archived ({{ onHoldKeywordsCount }})
          </Text>
          <Icon :name="isOnHoldGroupOpen ? 'ChevronUp' : 'ChevronDown'" type="outline" size="sm" color="gray-500" />
        </div>
        <ul v-if="isOnHoldGroupOpen" class="space-y-2 pt-1">
           <KeywordListItem
              v-for="(keyword, index) in filteredKeywords('ON_HOLD')"
              :key="index"
              :keyword="keyword"
              :index="index"
              @edit-request="handleKeywordEdit"
          />
          </ul>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import KeywordListItem from '@/components/molecules/KeywordListItem.vue';
import type { TopicKeyword } from '@/interfaces/initiation';


// ----------------------------------------------------------------------
// --- Props & Emits ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** List of keywords, status, and source from the parent component (SidebarContent). */
  keywords: TopicKeyword[];
}>();

const emit = defineEmits<{
  /** Emitted when a user clicks the Add button. */
  (e: 'add-request'): void;

  /** Emitted when a user clicks an existing keyword item to open the refinement modal. */
  (e: 'edit-request', payload: { index: number, keyword: TopicKeyword }): void;
}>();


// ----------------------------------------------------------------------
// --- Internal State (Fold/Collapse Management) ---
// ----------------------------------------------------------------------

const isReviewGroupOpen = ref(true); // Default to open
const isOnHoldGroupOpen = ref(false); // Default to closed


// ----------------------------------------------------------------------
// --- Computed Properties ---
// ----------------------------------------------------------------------

/** Calculates the number of locked keywords for the progress tracker. */
const lockedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'LOCKED').length;
});

/** Calculates the number of keywords that need user attention (AI_EXTRACTED or USER_DRAFT). */
const unreviewedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'AI_EXTRACTED' || k.status === 'USER_DRAFT').length;
});

/** Calculates the number of keywords that are archived. */
const onHoldKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'ON_HOLD').length;
});


// ----------------------------------------------------------------------
// --- Methods ---
// ----------------------------------------------------------------------

/** Filters keywords based on the group type for the collapsible sections. */
const filteredKeywords = (group: 'LOCKED' | 'REVIEW' | 'ON_HOLD') => {
    switch (group) {
        case 'LOCKED':
            return props.keywords.filter(k => k.status === 'LOCKED');
        case 'REVIEW':
            return props.keywords.filter(k => k.status === 'AI_EXTRACTED' || k.status === 'USER_DRAFT');
        case 'ON_HOLD':
            return props.keywords.filter(k => k.status === 'ON_HOLD');
        default:
            return [];
    }
};

/** Toggles the open/closed state of the keyword groups. */
const toggleGroup = (group: 'REVIEW' | 'HOLD') => {
    if (group === 'REVIEW') {
        isReviewGroupOpen.value = !isReviewGroupOpen.value;
    } else if (group === 'HOLD') {
        isOnHoldGroupOpen.value = !isOnHoldGroupOpen.value;
    }
};

/**
 * Handles the edit-request event from the child KeywordListItem and re-emits it
 * to the parent component (SidebarContent).
 */
const handleKeywordEdit = (payload: { index: number, keyword: TopicKeyword }) => {
    emit('edit-request', payload);
};
</script>
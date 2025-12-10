<template>
  <div class="space-y-3">

    <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
      <Text tag="span" size="lg" weight="semibold" color="gray-800">Research Scope & Boundaries</Text>

      <Button variant="tertiary" size="sm" @click="emit('add-request')">
        <Icon name="Plus" type="outline" size="sm" color="gray-600" />
      </Button>
    </Text>

    <div class="flex items-center space-x-4">
      <Text tag="span" size="sm" weight="medium" color="indigo-600">
          <Icon name="LockClosed" type="outline" size="xs" class="mr-1" />
          {{ lockedScopeCount }}/{{ props.scope.length }} Locked
      </Text>

      <Text v-if="unreviewedScopeCount > 0" tag="span" size="sm" weight="bold" color="yellow-700"
            class="px-2 py-0.5 rounded-full border border-yellow-300 bg-yellow-100 cursor-pointer hover:bg-yellow-200 transition"
            @click="toggleGroup('REVIEW')">
          <Icon name="ExclamationCircle" type="outline" size="xs" class="mr-1" />
          {{ unreviewedScopeCount }} To Review
      </Text>
    </div>

    <div class="space-y-4">

      <div v-if="filteredScope('LOCKED').length > 0">
        <Text tag="h4" size="sm" weight="semibold" color="indigo-700" class="border-b pb-1">Core Boundaries</Text>
        <ul class="space-y-2 pt-1">
          <ScopeListItem
              v-for="(item, index) in filteredScope('LOCKED')"
              :key="index"
              :scope-element="item"
              :index="index"
              @edit-request="handleScopeEdit"
          />
        </ul>
      </div>

      <div v-if="unreviewedScopeCount > 0">
        <div class="flex items-center justify-between cursor-pointer border-b pb-1" @click="toggleGroup('REVIEW')">
          <Text tag="h4" size="sm" weight="semibold" :color="unreviewedScopeCount > 0 ? 'yellow-700' : 'gray-700'">
            To Review / Draft
          </Text>
          <Icon :name="isReviewGroupOpen ? 'ChevronUp' : 'ChevronDown'" type="outline" size="sm" color="gray-600" />
        </div>
        <ul v-if="isReviewGroupOpen" class="space-y-2 pt-1">
           <ScopeListItem
              v-for="(item, index) in filteredScope('REVIEW')"
              :key="index"
              :scope-element="item"
              :index="index"
              @edit-request="handleScopeEdit"
          />
        </ul>
      </div>

      <div v-if="onHoldScopeCount > 0">
        <div class="flex items-center justify-between cursor-pointer border-b pb-1" @click="toggleGroup('HOLD')">
          <Text tag="h4" size="sm" weight="semibold" color="gray-500">
            On Hold / Archived ({{ onHoldScopeCount }})
          </Text>
          <Icon :name="isOnHoldGroupOpen ? 'ChevronUp' : 'ChevronDown'" type="outline" size="sm" color="gray-500" />
        </div>

        <ul v-if="isOnHoldGroupOpen" class="space-y-2 pt-1">
           <template
             v-for="(item, index) in filteredScope('ON_HOLD')"
             :key="index"
           >
             <ScopeListItem
               v-if="isViewingAll || index < 3"
               :scope-element="item"
               :index="index"
               @edit-request="handleScopeEdit"
             />
           </template>

           <div v-if="!isViewingAll && onHoldScopeCount > 3" class="pt-1">
             <Text tag="span" size="sm" weight="medium" color="gray-500" class="cursor-pointer hover:text-gray-700" @click="isViewingAll = true">
                 View All ({{ onHoldScopeCount - 3 }} more)
             </Text>
           </div>
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
import ScopeListItem from '@/components/molecules/ScopeListItem.vue';
import type { TopicScopeElement, TopicScopeElementStatus } from '@/interfaces/initiation';


// ----------------------------------------------------------------------
// --- Props & Emits ---
// ----------------------------------------------------------------------

const props = defineProps<{
  /** List of scope elements from the parent component. */
  scope: TopicScopeElement[];
}>();

const emit = defineEmits<{
  /** Emitted when a user clicks the Add button. */
  (e: 'add-request'): void;

  /** Emitted when a user clicks an existing scope item to open the refinement modal. */
  (e: 'edit-request', payload: { index: number, scope: TopicScopeElement }): void;
}>();


// ----------------------------------------------------------------------
// --- Internal State (Fold/Collapse & Viewing Management) ---
// ----------------------------------------------------------------------

const isReviewGroupOpen = ref(true);    // Default to open (for REVIEW)
const isOnHoldGroupOpen = ref(false); // Default to closed (for ON_HOLD)
const isViewingAll = ref(false);        // Controls the 'View All' state for ON_HOLD items


// ----------------------------------------------------------------------
// --- Computed Properties ---
// ----------------------------------------------------------------------

/** Calculates the number of locked scope elements. */
const lockedScopeCount = computed(() => {
  return props.scope.filter(k => k.status === 'LOCKED').length;
});

/** Calculates the number of scope elements that need user attention (USER_DRAFT or AI_EXTRACTED). */
const unreviewedScopeCount = computed(() => {
  // === UPDATED LOGIC ===
  return props.scope.filter(k => k.status === 'USER_DRAFT' || k.status === 'AI_EXTRACTED').length;
});

/** Calculates the number of scope elements that are on hold (Discarded/Archived). */
const onHoldScopeCount = computed(() => {
  // === UPDATED LOGIC ===
  return props.scope.filter(k => k.status === 'ON_HOLD').length;
});


// ----------------------------------------------------------------------
// --- Methods ---
// ----------------------------------------------------------------------

/** Filters scope elements based on the group type for the collapsible sections.
 * NOTE: We use 'REVIEW' and 'ON_HOLD' internally for filtering.
 */
const filteredScope = (group: 'LOCKED' | 'REVIEW' | 'ON_HOLD') => {
    switch (group) {
        case 'LOCKED':
            return props.scope.filter(k => k.status === 'LOCKED');
        case 'REVIEW':
            // === UPDATED LOGIC ===
            return props.scope.filter(k => k.status === 'USER_DRAFT' || k.status === 'AI_EXTRACTED');
        case 'ON_HOLD':
            // === UPDATED LOGIC ===
            return props.scope.filter(k => k.status === 'ON_HOLD');
        default:
            return [];
    }
};

/** Toggles the open/closed state of the scope groups. */
const toggleGroup = (group: 'REVIEW' | 'HOLD') => {
    if (group === 'REVIEW') {
        isReviewGroupOpen.value = !isReviewGroupOpen.value;
    } else if (group === 'HOLD') {
        isOnHoldGroupOpen.value = !isOnHoldGroupOpen.value;
        // Reset the viewing limit when the group is closed or re-opened
        isViewingAll.value = false;
    }
};

/**
 * Handles the edit-request event from the child ScopeListItem and re-emits it
 * to the parent component (SidebarContent).
 */
const handleScopeEdit = (payload: { index: number, scope: TopicScopeElement }) => {
    emit('edit-request', payload);
};
</script>
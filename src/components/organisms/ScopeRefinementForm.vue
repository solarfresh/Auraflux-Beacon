<template>
  <div class="space-y-8 p-6">
    <Text tag="h2" size="2xl" weight="bold" color="gray-900">
      Research Scope Management
    </Text>
    <Text tag="p" size="md" color="gray-600">
      Precisely define the boundaries of your research. A well-defined scope (e.g., time, geography) improves the **Feasibility Status** of your topic.
    </Text>

    <ul class="space-y-4">
      <li
        v-for="(item, index) in localScope"
        :key="index"
        class="border p-4 rounded-lg bg-white shadow-sm transition duration-150"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <Text tag="span" size="base" weight="semibold" color="gray-800">{{ item.label }}</Text>

            <input
              v-model="item.value"
              type="text"
              :placeholder="`Enter value for ${item.label}`"
              class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
            />
          </div>

          <div class="flex items-center space-x-2">
            <Icon
              :name="item.status === 'LOCKED' ? 'LockClosed' : 'LockOpen'"
              type="solid"
              size="sm"
              :color="item.status === 'LOCKED' ? 'indigo-600' : 'gray-400'"
            />
            <Text tag="span" size="sm" :color="item.status === 'LOCKED' ? 'indigo-600' : 'gray-400'">
              {{ item.status }}
            </Text>
          </div>
        </div>
      </li>
    </ul>

    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
      <div class="flex items-center space-x-2">
        <Icon name="ExclamationTriangle" type="solid" size="sm" color="yellow-600" />
        <Text tag="h3" size="base" weight="semibold" color="yellow-700">
          Scope Validation
        </Text>
      </div>
      <Text tag="p" size="sm" color="yellow-600">
        **Current Feasibility Status: {{ feasibilityStatus }}.** Defining a narrower scope for **{{ undefinedItemsCount }}** undefined element(s) may improve resource abundance.
      </Text>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <Button variant="secondary" @click="emit('close-modal')">
        Cancel
      </Button>
      <Button :disabled="!isSaveEnabled" @click="handleSaveAndLockAll">
        <Icon name="DocumentCheck" type="solid" size="sm" />
        Save & Lock Scope
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import type { TopicScopeElement, FeasibilityStatus } from '@/interfaces/workflow';

// Define a deep copy for local editing
type EditableScope = TopicScopeElement & { isDirty: boolean };

// --- Props ---
const props = defineProps<{
  /** List of scope items (e.g., Geographical, Timeframe). */
  initialScope: TopicScopeElement[];
  /** Current feasibility status for feedback. */
  feasibilityStatus: FeasibilityStatus;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when the user confirms the updated scope. */
  (e: 'scopeUpdate', newScope: TopicScopeElement[]): void;
  /** Emitted to close the modal. */
  (e: 'close-modal'): void;
}>();


// --- State ---
// Create a deep, editable copy of the scope props
const localScope = ref<TopicScopeElement[]>(JSON.parse(JSON.stringify(props.initialScope)));

// Watcher to reset local state if the initialScope prop changes externally
watch(() => props.initialScope, (newScope) => {
    localScope.value = JSON.parse(JSON.stringify(newScope));
});


// --- Computed ---

/** Checks if any item has been edited or if any item is unlocked but has a value. */
const isSaveEnabled = computed(() => {
    // Check if any item has a non-empty value but is not yet locked
    return localScope.value.some(item =>
        (item.value && item.value.trim() !== '' && item.status === 'DRAFT') ||
        // Or if an already locked item's value was changed
        item.status === 'LOCKED' && props.initialScope.find(i => i.label === item.label)?.value !== item.value
    );
});

/** Counts how many scope items are still undefined or marked DRAFT. */
const undefinedItemsCount = computed(() => {
    return localScope.value.filter(item => !item.value || item.status === 'DRAFT').length;
});


// --- Methods ---

/** Handles the final save and lock action for all items. */
function handleSaveAndLockAll() {
    // 1. Process local changes: lock all items that have a defined value
    const finalScope = localScope.value.map(item => {
        if (item.value && item.value.trim() !== '') {
            // Force status to LOCKED upon saving
            return { ...item, value: item.value.trim(), status: 'LOCKED' as const };
        }
        return item;
    });

    // 2. Emit the update event
    emit('scopeUpdate', finalScope);

    // 3. Close the modal
    emit('close-modal');
}
</script>
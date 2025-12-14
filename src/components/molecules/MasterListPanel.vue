<template>
  <div class="w-1/3 max-h-lvh border-r border-gray-200 p-4 bg-gray-50 flex flex-col">

    <div class="flex justify-between items-center mb-4 sticky top-0 bg-gray-50 pt-1 pb-3 z-10 border-b border-gray-100">

      <Text tag="h2" size="xl" weight="bold" color="gray-900">
        {{ title }} ({{ itemCount }})
      </Text>

      <Button
        variant="primary"
        size="sm"
        @click="$emit('new-entry')"
        :disabled="disableNewEntry"
      >
        <Icon name="Plus" type="outline" size="sm" /> {{ newButtonLabel }}
      </Button>
    </div>

    <div class="flex-1 overflow-y-auto">

      <slot name="list-items"></slot>

      <slot name="empty-state">
        <p v-if="itemCount === 0" class="text-center text-gray-500 py-10">
          No {{ title.toLowerCase() }} found. Start a new one!
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

// --- PROPS ---
const props = defineProps({
  /**
   * Title of the list panel (e.g., 'Log Entries', 'Projects').
   */
  title: {
    type: String,
    required: true,
  },
  /**
   * The total number of items to display in the header count.
   */
  itemCount: {
    type: Number,
    required: true,
  },
  /**
   * Label for the 'New' action button.
   */
  newButtonLabel: {
    type: String,
    default: 'New Entry',
  },
  /**
   * Boolean to disable the 'New Entry' button (e.g., when an item is currently being edited).
   */
  disableNewEntry: {
    type: Boolean,
    default: false,
  },
});

// --- EMITS ---
const emit = defineEmits<{
  /**
   * Emitted when the 'New Entry' button is clicked.
   */
  (e: 'new-entry'): void;
}>();
</script>

<style scoped>
/* Ensures the list content area uses available vertical space */
.flex-1 {
  flex-grow: 1;
}
</style>
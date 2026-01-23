<template>
  <div class="h-full border-r border-gray-200 bg-gray-50 flex flex-col min-w-[320px]">

    <header class="sticky top-0 z-10 bg-gray-50 pt-5 pb-4 px-4 border-b border-gray-100 flex justify-between items-center">
      <Text tag="h2" size="xl" weight="bold" color="gray-900">
        {{ title }} <span class="text-gray-400 font-medium ml-1">({{ itemCount }})</span>
      </Text>

      <Button
        variant="primary"
        size="sm"
        iconName="Plus"
        :disabled="disableNewEntry"
        @click="$emit('new-entry')"
      >
        {{ newButtonLabel }}
      </Button>
    </header>

    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <slot name="list-items"></slot>

      <slot name="empty-state">
        <div v-if="itemCount === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Icon name="DocumentPlus" size="lg" color="gray-300" class="mb-3" />
          <Text tag="p" size="sm" color="gray-500">
            No {{ title.toLowerCase() }} found. Start a new one!
          </Text>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

/**
 * MasterListPanel Organism
 * A high-level layout component for vertical lists with action headers.
 */
defineProps({
  title: { type: String, required: true },
  itemCount: { type: Number, required: true },
  newButtonLabel: { type: String, default: 'New Entry' },
  disableNewEntry: { type: Boolean, default: false },
});

defineEmits<{
  (e: 'new-entry'): void;
}>();
</script>
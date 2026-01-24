<template>
  <aside
    class="h-full border-r border-gray-200 bg-gray-50 flex flex-col min-w-[340px] max-w-[420px] transition-all"
  >
    <header class="flex-shrink-0 pt-6 pb-4 px-5 bg-gray-50/95 backdrop-blur-sm sticky top-0 z-10 border-b border-transparent">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-baseline gap-2">
          <Text tag="h2" size="xl" weight="bold" color="gray-900">
            {{ title }}
          </Text>
          <Text
            v-if="itemCount !== undefined"
            tag="span"
            size="sm"
            weight="medium"
            color="gray-400"
          >
            ({{ itemCount }})
          </Text>
        </div>

        <slot name="header-actions">
          <Button
            v-if="showNewButton"
            variant="primary"
            size="sm"
            iconName="Plus"
            :disabled="disableNewButton"
            @click="emit('new-entry')"
          >
            {{ newButtonLabel }}
          </Button>
        </slot>
      </div>

      <slot name="header-extension" />
    </header>

    <div class="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
      <slot name="list-items" />

      <div
        v-if="isEmpty"
        class="flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <slot name="empty-state">
          <Icon name="Inbox" size="lg" color="gray-300" class="mb-3" />
          <Text size="sm" color="gray-500">
            No items available in {{ title.toLowerCase() }}.
          </Text>
        </slot>
      </div>
    </div>

    <footer v-if="$slots.footer" class="p-4 border-t border-gray-100 bg-white/50">
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';

/**
 * MasterListPanel: The structural backbone of sidebars.
 * It is presentational only, relying on slots for content and business logic.
 */
const props = withDefaults(defineProps<{
  title: string;
  itemCount?: number;
  isEmpty?: boolean;
  showNewButton?: boolean;
  newButtonLabel?: string;
  disableNewButton?: boolean;
}>(), {
  itemCount: undefined,
  isEmpty: false,
  showNewButton: false,
  newButtonLabel: 'New Entry',
  disableNewButton: false,
});

const emit = defineEmits<{
  /** Triggered when the default New Button is clicked */
  (e: 'new-entry'): void;
}>();
</script>
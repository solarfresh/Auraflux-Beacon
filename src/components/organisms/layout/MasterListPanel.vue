<template>
  <aside
    class="flex flex-col overflow-hidden transition-all duration-200 shadow-sm"
    :class="$attrs.class"
  >
    <header class="flex-shrink-0 z-10 sticky top-0 bg-inherit/95 backdrop-blur-sm border-b border-gray-100">
      <div class="pt-6 pb-4 px-5">
        <div class="flex items-center justify-between">
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
              icon-name="Plus"
              :disabled="disableNewButton"
              @click="emit('new-entry')"
            >
              {{ newButtonLabel }}
            </Button>
          </slot>
        </div>
      </div>

      <slot name="header-extension" />
    </header>

    <div
      class="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2"
      :class="bodyClass"
    >
      <slot name="list-items" />

      <div
        v-if="isEmpty"
        class="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <slot name="empty-state">
          <Icon name="Inbox" size="lg" color="gray-300" class="mb-3" />
          <Text size="sm" color="gray-500">
            No items found in {{ title.toLowerCase() }}.
          </Text>
        </slot>
      </div>
    </div>

    <footer v-if="$slots.footer" class="flex-shrink-0 mt-auto border-t border-gray-100">
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/data-display/Text.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';

/**
 * MasterListPanel: Optimized for Master-Detail navigation patterns.
 * Best used inside Modals or Admin views where a list-driven selection
 * triggers a detail view on the right.
 */

const props = withDefaults(defineProps<{
  title: string;
  itemCount?: number;
  isEmpty?: boolean;
  /** UI control for the default "New" button */
  showNewButton?: boolean;
  newButtonLabel?: string;
  disableNewButton?: boolean;
  /** Custom classes for the scrollable list container */
  bodyClass?: string;
}>(), {
  itemCount: undefined,
  isEmpty: false,
  showNewButton: true,
  newButtonLabel: 'New Entry',
  disableNewButton: false,
  bodyClass: '',
});

const emit = defineEmits<{
  (e: 'new-entry'): void;
}>();
</script>

<style scoped>
/* Scoped styles kept minimal, relying on global scrollbar-gutter */
aside {
  scrollbar-gutter: stable;
}
</style>
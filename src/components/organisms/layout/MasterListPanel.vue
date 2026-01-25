<template>
  <BaseSidebarLayout
    :title="title"
    :item-count="itemCount"
    :is-empty="isEmpty"
    class="shadow-sm"
  >
    <template #header-actions>
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
    </template>

    <template #header-extension>
      <slot name="header-extension" />
    </template>

    <template #body>
      <Box
        padding="xs"
        v-bind="$attrs"
      >
        <Stack gap="sm">
          <slot name="list-items" />
        </Stack>
      </Box>
    </template>

    <template #empty-state>
      <slot name="empty-state">
        <Stack align="center" justify="center" gap="sm" class="py-16 px-6">
          <Icon name="Inbox" size="lg" color="gray-300" />
          <Text size="sm" color="gray-500">
            No items found in {{ title.toLowerCase() }}.
          </Text>
        </Stack>
      </slot>
    </template>

    <template #footer>
      <slot name="footer" />
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
/**
 * MasterListPanel (Organism)
 * Optimized for list-driven selection patterns.
 * * * ARCHITECTURAL CHANGE:
 * Removed 'bodyClass' prop. External classes are now caught by $attrs
 * and applied directly to the internal Box to prevent array nesting.
 */
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';

// We disable attribute inheritance on the root so we can
// manually bind $attrs to the specific internal Box container.
defineOptions({
  inheritAttrs: false
});

interface Props {
  title: string;
  itemCount?: number;
  isEmpty?: boolean;
  showNewButton?: boolean;
  newButtonLabel?: string;
  disableNewButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: undefined,
  isEmpty: false,
  showNewButton: true,
  newButtonLabel: 'New Entry',
  disableNewButton: false,
});

const emit = defineEmits<{
  (e: 'new-entry'): void;
}>();
</script>
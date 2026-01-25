<template>
  <BaseSidebarLayout
    :title="title"
    :item-count="itemCount"
    :is-empty="isEmpty"
    class="shadow-sm"
  >
    <template #header-actions>
      <slot name="header-actions">
        <VButton
          v-if="showNewButton"
          variant="primary"
          size="sm"
          icon-name="Plus"
          :disabled="disableNewButton"
          @click="emit('new-entry')"
        >
          {{ newButtonLabel }}
        </VButton>
      </slot>
    </template>

    <template #header-extension>
      <slot name="header-extension" />
    </template>

    <template #body>
      <VBox
        padding="xs"
        v-bind="$attrs"
      >
        <VStack gap="sm">
          <slot name="list-items" />
        </VStack>
      </VBox>
    </template>

    <template #empty-state>
      <slot name="empty-state">
        <VStack align="center" justify="center" gap="sm" class="py-16 px-6">
          <VIcon name="Inbox" size="lg" color="gray-300" />
          <VTypography size="sm" color="gray-500">
            No items found in {{ title.toLowerCase() }}.
          </VTypography>
        </VStack>
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
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';

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
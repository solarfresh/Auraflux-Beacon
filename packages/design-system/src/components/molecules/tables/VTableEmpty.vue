<template>
  <VTableRow :hoverable="false">
    <VTableCell :colspan="colspan" align="center" padding="lg">
      <VBox
        tag="div"
        padding="none"
        border="none"
        background="transparent"
        class="flex flex-col items-center justify-center w-full"
      >
        <VStack gap="sm" align="center">
          <!-- Icon or custom graphic slot -->
          <slot name="icon" />

          <!-- Primary title text -->
          <VTypography size="sm" weight="semibold">
            {{ title }}
          </VTypography>

          <!-- Secondary description text -->
          <VTypography
            v-if="description"
            size="xs"
            attention="tertiary"
            class="max-w-sm text-balance"
          >
            {{ description }}
          </VTypography>

          <!-- Action slot for call-to-action buttons (e.g., refresh or create) -->
          <VBox
            v-if="$slots.action"
            tag="div"
            padding="none"
            border="none"
            class="mt-2"
          >
            <slot name="action" />
          </VBox>
        </VStack>
      </VBox>
    </VTableCell>
  </VTableRow>
</template>

<script setup lang="ts">
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

export interface VTableEmptyProps {
  /** Total number of columns to span across the table */
  colspan?: number;
  /** Primary title displayed in the empty state */
  title?: string;
  /** Optional secondary context or description text */
  description?: string;
}

withDefaults(defineProps<VTableEmptyProps>(), {
  colspan: 1,
  title: 'No Data Available',
  description: '',
});
</script>
<template>
  <VBox
    tag="div"
    padding="md"
    border="top"
    background="transparent"
    class="w-full flex items-center justify-between border-slate-200"
  >
    <VCluster gap="md" align="center">
      <!-- Total records & page summary -->
      <VTypography size="xs" attention="tertiary">
        Showing
        <VTypography tag="span" size="xs" weight="medium" class="text-slate-700">
          {{ itemRangeStart }}
        </VTypography>
        to
        <VTypography tag="span" size="xs" weight="medium" class="text-slate-700">
          {{ itemRangeEnd }}
        </VTypography>

        of
        <VTypography tag="span" size="xs" weight="medium" class="text-slate-700">
          {{ totalItems }}
        </VTypography>
        results
      </VTypography>

      <!-- Page size selection -->
      <VCluster v-if="pageSizeOptions.length" gap="xs" align="center">
        <VTypography size="xs" attention="tertiary">Rows per page:</VTypography>
        <VSelect
          :model-value="pageSize"
          size="xs"
          attention="secondary"
          :disabled="disabled"
          class="!w-auto"
          @update:model-value="handlePageSizeChange"
        >
          <option
            v-for="option in pageSizeOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </VSelect>
      </VCluster>
    </VCluster>

    <!-- Page navigation controls -->
    <VCluster gap="xs" align="center">
      <!-- First page -->
      <VButton
        v-if="showFirstLastButtons"
        size="xs"
        attention="tertiary"
        surface="ghost"
        icon-name="ChevronDoubleLeft"
        :icon-only="true"
        :disabled="currentPage === 1 || disabled"
        @click="goToPage(1)"
      />

      <!-- Previous page -->
      <VButton
        size="xs"
        attention="tertiary"
        surface="ghost"
        icon-name="ChevronLeft"
        :icon-only="true"
        :disabled="currentPage === 1 || disabled"
        @click="goToPage(currentPage - 1)"
      />

      <!-- Page indicator -->
      <VTypography size="xs" weight="medium" class="px-2">
        Page {{ currentPage }} of {{ totalPages }}
      </VTypography>

      <!-- Next page -->
      <VButton
        size="xs"
        attention="tertiary"
        surface="ghost"
        icon-name="ChevronRight"
        :icon-only="true"
        :disabled="currentPage === totalPages || disabled"
        @click="goToPage(currentPage + 1)"
      />

      <!-- Last page -->
      <VButton
        v-if="showFirstLastButtons"
        size="xs"
        attention="tertiary"
        surface="ghost"
        icon-name="ChevronDoubleRight"
        :icon-only="true"
        :disabled="currentPage === totalPages || disabled"
        @click="goToPage(totalPages)"
      />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

export interface VTablePaginationProps {
  /** Active zero-indexed or 1-indexed page index (1-indexed default) */
  currentPage?: number;
  /** Number of items displayed per page */
  pageSize?: number;
  /** Total count of items across all pages */
  totalItems?: number;
  /** Selectable page size options list */
  pageSizeOptions?: number[];
  /** Whether to render jump to first/last page buttons */
  showFirstLastButtons?: boolean;
  /** Disable interactive controls */
  disabled?: boolean;
}

const props = withDefaults(defineProps<VTablePaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageSizeOptions: () => [10, 20, 50, 100],
  showFirstLastButtons: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'change', payload: { page: number; pageSize: number }): void;
}>();

const totalPages = computed(() => {
  if (props.totalItems <= 0) return 1;
  return Math.ceil(props.totalItems / props.pageSize);
});

const itemRangeStart = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const itemRangeEnd = computed(() => {
  const end = props.currentPage * props.pageSize;
  return end > props.totalItems ? props.totalItems : end;
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || props.disabled) return;
  emit('update:currentPage', page);
  emit('change', { page, pageSize: props.pageSize });
};

const handlePageSizeChange = (newSize: number) => {
  emit('update:pageSize', Number(newSize));
  emit('update:currentPage', 1);
  emit('change', { page: 1, pageSize: Number(newSize) });
};
</script>
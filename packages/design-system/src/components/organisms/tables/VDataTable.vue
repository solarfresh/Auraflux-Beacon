<template>
  <VBox
    tag="div"
    padding="none"
    border="all"
    rounded="lg"
    background="transparent"
    class="w-full overflow-hidden flex flex-col border-slate-200"
  >
    <!-- Table Body Block -->
    <VBox tag="div" padding="none" border="none" class="w-full overflow-x-auto">
      <VTable :intent="intent" :size="size">
        <!-- Table Header Section -->
        <VTableHead>
          <VTableRow>
            <!-- Select All Checkbox Cell -->
            <VTableHeader v-if="selectable" width="40px" align="center">
              <VCheckbox
                :model-value="isAllSelected"
                size="xs"
                attention="secondary"
                @update:model-value="toggleSelectAll"
              />
            </VTableHeader>

            <!-- Column Headers -->
            <VTableHeader
              v-for="col in columns"
              :key="col.key"
              :align="col.align || 'start'"
              :sortable="col.sortable"
              :sort-order="activeSortKey === col.key ? activeSortOrder : undefined"
              :hint="col.hint"
              :width="col.width"
              @sort="handleSort(col.key)"
            >
              {{ col.label }}
            </VTableHeader>
          </VTableRow>
        </VTableHead>

        <!-- Table Body Section -->
        <VTableBody>
          <!-- Empty State Block -->
          <template v-if="!data || data.length === 0">
            <VTableEmpty
              :colspan="totalColspan"
              :title="emptyTitle"
              :description="emptyDescription"
            >
              <template v-if="$slots['empty-icon']" #icon>
                <slot name="empty-icon" />
              </template>
              <template v-if="$slots['empty-action']" #action>
                <slot name="empty-action" />
              </template>
            </VTableEmpty>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <VTableRow
              v-for="(row, rowIndex) in paginatedData"
              :key="getRowKey(row, rowIndex)"
              :selected="isRowSelected(row)"
              @click="handleRowClick(row)"
            >
              <!-- Row Selection Checkbox Cell -->
              <VTableCell v-if="selectable" align="center" @click.stop>
                <VCheckbox
                  :model-value="isRowSelected(row)"
                  size="xs"
                  attention="secondary"
                  @update:model-value="() => toggleSelectRow(row)"
                />
              </VTableCell>

              <!-- Dynamic Column Cell Render -->
              <VTableCell
                v-for="col in columns"
                :key="col.key"
                :align="col.align || 'start'"
              >
                <!-- Custom Column Cell Slot -->
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :value="row[col.key]"
                  :index="rowIndex"
                >
                  {{ row[col.key] }}
                </slot>
              </VTableCell>
            </VTableRow>
          </template>
        </VTableBody>
      </VTable>
    </VBox>

    <!-- Pagination Footer Section -->
    <VTablePagination
      v-if="pagination"
      v-model:currentPage="currentPage"
      v-model:pageSize="internalPageSize"
      :total-items="totalItems"
      :page-size-options="pageSizeOptions"
    />
  </VBox>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
import VCheckbox from '@auraflux/design-system/components/atoms/forms/VCheckbox.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableEmpty from '@auraflux/design-system/components/molecules/tables/VTableEmpty.vue';
import VTablePagination from '@auraflux/design-system/components/molecules/tables/VTablePagination.vue';
import type { Alignment, ComponentSizeToken, IntentToken } from '@auraflux/design-system/interfaces/theme';
import { computed, ref, watch } from 'vue';

export interface VDataTableColumn {
  /** Property key mapping to data object */
  key: string;
  /** Header label display text */
  label: string;
  /** Alignment of column text content */
  align?: Alignment;
  /** Whether column can be sorted */
  sortable?: boolean;
  /** Contextual hint tooltip string */
  hint?: string;
  /** Explicit CSS width */
  width?: string;
}

export interface VDataTableProps<TData = Record<string, any>> {
  /** Column definitions config */
  columns: VDataTableColumn[];
  /** Table data records collection */
  data: TData[];
  /** Primary identifier key for selection row tracking */
  rowKey?: string;
  /** Semantic intent theme override */
  intent?: IntentToken;
  /** Density size variant */
  size?: ComponentSizeToken;
  /** Enable row selection checkbox column */
  selectable?: boolean;
  /** Selected row keys v-model binding */
  selectedKeys?: (string | number)[];
  /** Enable integrated pagination footer */
  pagination?: boolean;
  /** Controlled page size */
  pageSize?: number;
  /** Total records override (for server-side pagination) */
  total?: number;
  /** Selectable page size options list */
  pageSizeOptions?: number[];
  /** Empty state title string */
  emptyTitle?: string;
  /** Empty state description string */
  emptyDescription?: string;
}

const props = withDefaults(defineProps<VDataTableProps<T>>(), {
  rowKey: 'id',
  intent: 'neutral',
  size: 'sm',
  selectable: false,
  selectedKeys: () => [],
  pagination: true,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  emptyTitle: 'No Data Available',
  emptyDescription: '',
});

const emit = defineEmits<{
  (e: 'update:selectedKeys', keys: (string | number)[]): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'row-click', row: T): void;
  (e: 'sort-change', payload: { key: string; order: 'asc' | 'desc' }): void;
}>();

// Sorting state
const activeSortKey = ref<string | null>(null);
const activeSortOrder = ref<'asc' | 'desc'>('asc');

// Internal pagination state
const currentPage = ref(1);
const internalPageSize = ref(props.pageSize);

watch(() => props.pageSize, (newSize) => {
  internalPageSize.value = newSize;
});

watch(internalPageSize, (newSize) => {
  emit('update:pageSize', newSize);
});

const getRowKey = (row: T, index: number): string | number => {
  return row[props.rowKey] ?? index;
};

// Column count calculation including selection column
const totalColspan = computed(() => {
  return props.columns.length + (props.selectable ? 1 : 0);
});

// Selection handling
const isRowSelected = (row: T): boolean => {
  const key = getRowKey(row, -1);
  return props.selectedKeys.includes(key);
};

const toggleSelectRow = (row: T) => {
  const key = getRowKey(row, -1);
  const updatedKeys = isRowSelected(row)
    ? props.selectedKeys.filter((k) => k !== key)
    : [...props.selectedKeys, key];
  emit('update:selectedKeys', updatedKeys);
};

const isAllSelected = computed(() => {
  if (!props.data.length) return false;
  return props.data.every((row) => isRowSelected(row));
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    emit('update:selectedKeys', []);
  } else {
    const allKeys = props.data.map((row, index) => getRowKey(row, index));
    emit('update:selectedKeys', allKeys);
  }
};

// Local Sorting & Pagination logic
const sortedData = computed(() => {
  if (!activeSortKey.value) return props.data;
  const key = activeSortKey.value;
  const orderMult = activeSortOrder.value === 'asc' ? 1 : -1;

  return [...props.data].sort((a, b) => {
    if (a[key] < b[key]) return -1 * orderMult;
    if (a[key] > b[key]) return 1 * orderMult;
    return 0;
  });
});

const totalItems = computed(() => props.total ?? props.data.length);

const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value;
  const start = (currentPage.value - 1) * internalPageSize.value;
  return sortedData.value.slice(start, start + internalPageSize.value);
});

const handleSort = (key: string) => {
  if (activeSortKey.value === key) {
    activeSortOrder.value = activeSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    activeSortKey.value = key;
    activeSortOrder.value = 'asc';
  }
  emit('sort-change', { key, order: activeSortOrder.value });
};

const handleRowClick = (row: T) => {
  emit('row-click', row);
};
</script>
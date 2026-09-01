<template>
  <VTableHeader :align="align" :size="size" :padding="padding">
    <VCluster
      :align="alignCluster"
      gap="xs"
      :inline="true"
      class="select-none"
    >
      <VTypography size="xs" weight="semibold">
        <slot />
      </VTypography>

      <!-- Hint Tooltip -->
      <VTooltip v-if="hint" :content="hint">
        <VIcon
          name="QuestionMarkCircle"
          size="xs"
          class="text-slate-400 hover:text-slate-600 cursor-help"
        />
      </VTooltip>

      <VButton
        v-if="sortable"
        attention="tertiary"
        surface="ghost"
        size="xs"
        :icon-name="sortIconName"
        :icon-only="true"
        rounded="sm"
        border="none"
        @click="handleSortClick"
      />
    </VCluster>
  </VTableHeader>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTooltip from '@auraflux/design-system/components/molecules/indicators/VTooltip.vue';
import type { Alignment, ComponentSizeToken, SpacingToken } from '@auraflux/design-system/interfaces/theme';
import { computed } from 'vue';

export type SortOrder = 'asc' | 'desc' | false;

export interface VTableColumnHeaderProps {
  /** Text alignment inside the header cell */
  align?: Alignment;
  /** Size variant override for padding density */
  size?: ComponentSizeToken;
  /** Explicit padding override mapped to SHARED_PADDING_CLASSES */
  padding?: SpacingToken;
  /** Whether the column supports sorting */
  sortable?: boolean;
  /** Active sort state */
  sortOrder?: SortOrder;
  /** Explanatory hint message for tooltip display */
  hint?: string;
}

const props = withDefaults(defineProps<VTableColumnHeaderProps>(), {
  align: 'start',
  sortable: false,
  sortOrder: false,
});

const emit = defineEmits<{
  (e: 'sort', order: SortOrder): void;
}>();

const alignCluster = computed(() => {
  if (props.align === 'end') return 'end';
  if (props.align === 'center') return 'center';
  return 'start';
});

const sortIconName = computed(() => {
  if (props.sortOrder === 'asc') return 'ChevronUp';
  if (props.sortOrder === 'desc') return 'ChevronDown';
  return 'BarsArrowDown';
});

const handleSortClick = () => {
  let nextOrder: SortOrder = 'asc';
  if (props.sortOrder === 'asc') nextOrder = 'desc';
  else if (props.sortOrder === 'desc') nextOrder = false;

  emit('sort', nextOrder);
};
</script>
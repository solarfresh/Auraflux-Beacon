<template>
  <VBox
    tag="div"
    role="button"
    :aria-selected="isActive"
    padding="sm"
    rounded
    border="all"
    clickable
    v-bind="$attrs"
    :background="isActive ? 'indigo-50' : 'transparent'"
    :class="[
      'transition-all duration-150 group',
      isActive ? 'border-indigo-200 shadow-sm' : 'border-transparent hover:bg-gray-50'
    ]"
    @click="$emit('select')"
  >
    <VCluster justify="between" align="center" full-width>

      <VCluster gap="md" align="center" class="min-w-0 flex-1">
        <VIcon
          name="ViewColumns"
          size="sm"
          :color="isActive ? 'indigo-600' : 'gray-400'"
          class="flex-shrink-0"
        />

        <VTypography
          tag="span"
          size="sm"
          :weight="isActive ? 'bold' : 'medium'"
          :color="isActive ? 'indigo-900' : 'gray-700'"
          class="truncate"
        >
          {{ name }}
        </VTypography>
      </VCluster>

      <VCluster gap="xs" align="center">
        <VBox
          v-if="isActive"
          padding="none"
          rounded-full
          background="indigo-50"
          class="w-1.5 h-1.5 bg-indigo-500"
        />

        <VButton
          v-if="!isActive"
          variant="ghost"
          size="xs"
          icon-only
          icon-name="ChevronRight"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </VCluster>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * ViewListItem (Molecule)
 * Refactored to use Atom Layouts for consistent navigation spacing.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  /** Name of the view (e.g., "Table View", "Grid View") */
  name: string;
  /** Whether this view is currently being displayed */
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script>
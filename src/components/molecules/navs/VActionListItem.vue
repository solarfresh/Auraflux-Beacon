<template>
  <VBox
    tag="div"
    role="button"
    padding="sm"
    rounded
    border="all"
    clickable
    v-bind="$attrs"
    :background="uiStyles.bgColor"
    :class="[
      'transition-all duration-150 group',
      uiStyles.borderColor,
      { 'opacity-60 grayscale': scopeElement.entityStatus === 'ON_HOLD' }
    ]"
    @click="handleEdit"
  >
    <VCluster justify="between" align="center" gap="md" full-width>

      <VCluster align="center" gap="sm" class="min-w-0 flex-1">
        <VIcon
          :name="uiStyles.icon"
          type="outline"
          size="xs"
          :color="uiStyles.accentColor"
          class="flex-shrink-0"
        />

        <VCluster gap="xs" align="center" class="min-w-0 flex-1">
          <VTypography
            tag="span"
            size="sm"
            weight="bold"
            :color="uiStyles.labelColor"
            class="flex-shrink-0"
          >
            {{ scopeElement.label }}:
          </VTypography>

          <VTypography
            tag="span"
            size="sm"
            :color="uiStyles.valueColor"
            class="truncate"
          >
            {{ scopeElement.rationale || 'No rationale provided' }}
          </VTypography>
        </VCluster>
      </VCluster>

      <VIcon
        name="ChevronRight"
        size="sm"
        :color="uiStyles.accentColor"
        class="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
/**
 * ScopeListItem (Molecule)
 * Standardized for research boundaries (Inclusion/Exclusion criteria).
 * Refactored to eliminate manual flex/spacing in favor of Cluster/Box.
 */
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import type { EntityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Ensure attributes are applied to the Box and not the root wrapper
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  scopeElement: ProcessedScope;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'edit-request', payload: { index: number, scope: ProcessedScope }): void;
}>();

/** * Logic: Maps EntityStatus to Atomic Props and Token Colors
 */
const uiStyles = computed(() => {
  const status: EntityStatus = props.scopeElement.entityStatus;

  switch (status) {
    case 'AI_EXTRACTED':
    case 'USER_DRAFT':
      return {
        bgColor: 'slate-50' as const, // Standardized fallback for yellow hues
        borderColor: 'border-yellow-200 hover:border-yellow-300',
        labelColor: 'yellow-800',
        valueColor: 'yellow-700',
        accentColor: 'yellow-600',
        icon: status === 'AI_EXTRACTED' ? 'LightBulb' : 'PencilSquare',
      };
    case 'LOCKED':
      return {
        bgColor: 'indigo-50' as const,
        borderColor: 'border-indigo-200 hover:border-indigo-300',
        labelColor: 'indigo-800',
        valueColor: 'indigo-600',
        accentColor: 'indigo-500',
        icon: 'LockClosed',
      };
    case 'ON_HOLD':
      return {
        bgColor: 'slate-50' as const,
        borderColor: 'border-slate-200',
        labelColor: 'slate-500',
        valueColor: 'slate-400',
        accentColor: 'slate-400',
        icon: 'ArchiveBox',
      };
    default:
      return {
        bgColor: 'white' as const,
        borderColor: 'border-slate-200 hover:border-slate-300',
        labelColor: 'slate-800',
        valueColor: 'slate-600',
        accentColor: 'slate-500',
        icon: 'InformationCircle',
      };
  }
});

const handleEdit = () => {
  emit('edit-request', {
    index: props.index,
    scope: props.scopeElement,
  });
};
</script>
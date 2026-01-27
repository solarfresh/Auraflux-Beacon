<template>
  <VBox
    padding="sm"
    background="white"
    rounded="xl"
    border="all"
    class="flex items-center group hover:border-indigo-300 hover:shadow-sm transition-all animate-in fade-in zoom-in duration-200"
  >
    <VIcon
      v-if="iconName"
      :name="iconName"
      size="xs"
      :class="[iconClass, 'mr-2']"
    />

    <VTypography
      tag="span"
      size="sm"
      weight="medium"
      color="slate-700"
      :class="{ 'mr-3': removable }"
    >
      <slot>{{ label }}</slot>
    </VTypography>

    <VButton
      v-if="removable"
      variant="danger"
      size="xs"
      icon-name="XMark"
      icon-only
      class="opacity-0 group-hover:opacity-100 transition-opacity"
      @click.stop="$emit('remove')"
    />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VEntityChip Molecule
 * A standardized tag/chip for Keywords, Concepts, or Entities.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

interface Props {
  /** The text to display in the chip */
  label?: string;
  /** Heroicon name for the status indicator */
  iconName?: string;
  /** Custom CSS class for the icon (usually for semantic coloring) */
  iconClass?: string;
  /** Whether to show the delete action on hover */
  removable?: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'remove'): void;
}>();
</script>
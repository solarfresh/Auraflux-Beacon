<template>
  <VBox
    v-bind="$attrs"
    tag="button"
    border="dashed"
    background="slate-50"
    hover-background="indigo-50"
    padding="lg"
    rounded="xl"
    :clickable="true"
    class="w-full h-full transition-all duration-200 group"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <VStack gap="sm" align="center" justify="center">
      <VIcon
        :name="iconName"
        size="lg"
        :color="isHovered ? 'indigo-600' : 'slate-400'"
        class="transition-colors duration-200"
      />

      <VTypography
        size="sm"
        weight="medium"
        :color="isHovered ? 'indigo-700' : 'slate-500'"
        class="transition-colors duration-200"
      >
        <slot>{{ label }}</slot>
      </VTypography>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VInteractivePlaceholder
 * A functional molecule used in grids or lists to invite user creation.
 * Categorized under 'Indicators' as it signals an "available action state"
 * using a dashed border pattern.
 * * @category Molecules
 * @subcategory Indicators
 */
import { ref } from 'vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';

// Rule 4: Prevent automatic inheritance to manually bind to VBox
defineOptions({
  inheritAttrs: false
});

withDefaults(defineProps<{
  /** The name of the icon to display (from the VIcon library). */
  iconName?: string;
  /** The primary label text. Can also be provided via the default slot. */
  label?: string;
}>(), {
  iconName: 'Plus',
  label: 'Add New Item'
});

const isHovered = ref(false);
</script>
<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :class="[
      // Base styles: prevent shrinking in flex containers
      'shrink-0 inline-block align-middle transition-colors duration-150',
      variantStyles.text,
      sizeStyles.icon
    ]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as SolidIconsType from '@heroicons/vue/24/solid';
import * as OutlineIconsType from '@heroicons/vue/24/outline';
import type { ComponentVariant, ComponentSize } from '@auraflux/design-system/interfaces/theme';
import { SHARED_SIZE_CLASSES, SHARED_VARIANT_CLASSES } from '@auraflux/design-system/constants/theme';

const SolidIcons = SolidIconsType as Record<string, any>;
const OutlineIcons = OutlineIconsType as Record<string, any>;

export interface VIconProps {
  /** Icon name in PascalCase or kebab-case (e.g. 'CheckCircle', 'check-circle') */
  name: string;
  /** Icon style variant */
  type?: 'solid' | 'outline';
  /** Icon size preset */
  size?: ComponentSize;
  /** Tailwind text color class (e.g. 'text-indigo-600') */
  variant?: ComponentVariant;
}

const props = withDefaults(defineProps<VIconProps>(), {
  type: 'solid',
  size: 'md',
  variant: 'primary',
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const variantStyles = computed(() => {
  return SHARED_VARIANT_CLASSES[props.variant] || SHARED_VARIANT_CLASSES.primary;
});

// Normalize name string to Heroicons PascalCase convention (e.g., "check-circle" -> "CheckCircle")
const iconComponent = computed(() => {
  if (!props.name) return null;

  const pascalCaseName = props.name
    .replace(/(^\w|[- \s]\w)/g, (m) => m.toUpperCase())
    .replace(/[- \s]/g, '');

  const iconName = `${pascalCaseName}Icon`;
  const iconSet = props.type === 'solid' ? SolidIcons : OutlineIcons;

  return iconSet[iconName] || null;
});
</script>
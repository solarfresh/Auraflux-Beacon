<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :class="[
      // Base styles: prevent shrinking in flex containers and inherit color
      'shrink-0 inline-block align-middle transition-colors duration-150',
      sizeStyles.icon
    ]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as SolidIconsType from '@heroicons/vue/24/solid';
import * as OutlineIconsType from '@heroicons/vue/24/outline';
import type { ComponentSizeToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_COMPONENT_SIZE_CLASSES } from '@auraflux/design-system/constants/theme';

const SolidIcons = SolidIconsType as Record<string, any>;
const OutlineIcons = OutlineIconsType as Record<string, any>;

export interface VIconProps {
  /** Icon name in PascalCase or kebab-case (e.g. 'CheckCircle', 'check-circle') */
  name: string;
  /** Icon style variant */
  type?: 'solid' | 'outline';
  /** Icon size preset */
  size?: ComponentSizeToken;
}

const props = withDefaults(defineProps<VIconProps>(), {
  type: 'solid',
  size: 'md',
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.md;
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
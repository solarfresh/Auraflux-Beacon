<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :class="[
      // Base styles: prevent shrinking in flex containers
      'shrink-0 inline-block align-middle transition-colors duration-150',
      color,
      sizeClass
    ]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as SolidIconsType from '@heroicons/vue/24/solid';
import * as OutlineIconsType from '@heroicons/vue/24/outline';

const SolidIcons = SolidIconsType as Record<string, any>;
const OutlineIcons = OutlineIconsType as Record<string, any>;

export interface VIconProps {
  /** Icon name in PascalCase or kebab-case (e.g. 'CheckCircle', 'check-circle') */
  name: string;
  /** Icon style variant */
  type?: 'solid' | 'outline';
  /** Icon size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Tailwind text color class (e.g. 'text-indigo-600') */
  color?: string;
}

const props = withDefaults(defineProps<VIconProps>(), {
  type: 'solid',
  size: 'md',
  color: 'text-current',
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

const sizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
  };
  return sizeMap[props.size] || sizeMap.md;
});
</script>
<template>
  <component :is="iconComponent" :class="[colorClass, sizeClass]" />
</template>

<script setup lang="ts">
import * as SolidIconsType from '@heroicons/vue/24/solid';
import * as OutlineIconsType from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const SolidIcons = SolidIconsType as any;
const OutlineIcons = OutlineIconsType as any;

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'solid', // 'solid' or 'outline'
    validator: (value: string) => ['solid', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl, 2xl (maps to w-x h-x)
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value),
  },
  color: {
    type: String,
    default: 'current', // tailwind color, e.g., 'blue-500', 'slate-700'
  }
});

const iconComponent = computed(() => {
  const pascalCaseName = props.name.replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(/-/g, '');
  if (props.type === 'solid') {
    return SolidIcons[pascalCaseName + 'Icon'];
  } else {
    return OutlineIcons[pascalCaseName + 'Icon'];
  }
});

const sizeClass = computed(() => {
    const sizeMap = <{[key: string]: string;}>{
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10',
        '2xl': 'w-12 h-12',
    };
    return sizeMap[props.size];
});

const colorClass = computed(() => {
  return props.color === 'current' ? 'text-current' : `text-${props.color}`;
});
</script>
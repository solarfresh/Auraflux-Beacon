<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      baseClass,
      variantClass,
      computedSizeClass
    ]"
    @click="$emit('click', $event)"
  >
    <template v-if="iconOnly && iconName">
      <Icon :name="iconName" :size="size === 'xs' ? 'xs' : 'sm'" color="current" />
    </template>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import { ButtonProps } from '@/interfaces/button';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false,
  iconName: '',
  type: 'button'
});

defineEmits(['click']);

const baseClass = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed border';

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
    case 'secondary':
      return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm';
    case 'tertiary':
      return 'border-transparent bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-indigo-500';
    case 'destructive':
      return 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
    case 'ghost':
      return 'border-transparent bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100';
    case 'danger-ghost':
      return 'border-transparent bg-transparent text-gray-400 hover:text-red-600 hover:bg-red-50';
    default:
      return 'border-transparent';
  }
});

const computedSizeClass = computed(() => {
  // If it's iconOnly, we use square paddings
  if (props.iconOnly) {
    switch (props.size) {
      case 'xs': return 'p-0.5'; // Ultra-compact for list actions
      case 'sm': return 'p-1';
      case 'lg': return 'p-3';
      default:   return 'p-2';   // md
    }
  }

  // Standard button paddings
  switch (props.size) {
    case 'xs': return 'px-2 py-0.5 text-xs';
    case 'sm': return 'px-2.5 py-1.5 text-sm';
    case 'lg': return 'px-6 py-3 text-lg';
    default:   return 'px-4 py-2 text-sm'; // md
  }
});
</script>
<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'flex items-center justify-center transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1',
      variantClasses,
      sizeClasses,
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @click="$emit('click', $event)"
  >
    <slot>
      <Icon v-if="iconName" :name="iconName" :size="iconSize" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';

const props = defineProps<{
  iconName?: string;
  variant?: 'ghost' | 'danger' | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
}>();

const emit = defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-gray-400 hover:text-red-600 hover:bg-red-50 focus:ring-red-500';
    case 'subtle':
      return 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500';
    case 'ghost':
    default:
      return 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-400';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'p-0.5';
    case 'sm': return 'p-1';
    default: return 'p-2'; // md
  }
});

const iconSize = computed(() => (props.size === 'xs' ? 'xs' : 'sm'));
</script>
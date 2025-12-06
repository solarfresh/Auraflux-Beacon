<template>
  <button
    @click="$emit('click')"
    class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    :aria-label="ariaLabel"
  >
    <!-- Icon Atom -->
    <Icon
      name="XMark"
      type="outline"
      size="md"
      color="current"
    />
  </button>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';

defineProps({
  /**
   * Accessible label for the button, e.g., "Close dialog".
   */
  ariaLabel: {
    type: String,
    default: 'Close',
  },
});

defineEmits(['click']);
</script>
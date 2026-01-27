<template>
  <form @submit.prevent="emit('submit')" class="w-full">
    <VStack :gap="gap">
      <slot />
    </VStack>
  </form>
</template>

<script setup lang="ts">
import VStack from '@/components/atoms/layout/VStack.vue';

/**
 * Props:
 * @param gap - Controls the vertical spacing between form fields (default: md/16px)
 */
const props = withDefaults(defineProps<{
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}>(), {
  gap: 'md'
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();
</script>
<template>
  <form @submit.prevent="emit('submit')" class="w-full">
    <VStack :gap="gap">
      <slot />
    </VStack>
  </form>
</template>

<script setup lang="ts">
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { SizeToken } from '@auraflux/design-system/interfaces/theme';

export interface VFormProps {
  gap?: SizeToken;
};

/**
 * Props:
 * @param gap - Controls the vertical spacing between form fields (default: md/16px)
 */
const props = withDefaults(defineProps<VFormProps>(), {
  gap: 'md'
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();
</script>
<template>
  <!-- Main container mapping semantic variants to design tokens -->
  <VBox
    :background="theme.bg"
    :border="border ? 'all' : 'none'"
    :rounded="rounded"
    :padding="padding"
    :class="[
      'transition-all duration-300',
      border ? theme.border : '',
      theme.text
    ]"
  >
    <VStack gap="sm">

      <!-- Header slot: Reserved for Alert Icon and Title -->
      <VBox v-if="$slots.header" class="flex items-center gap-2">
        <slot name="header" />
      </VBox>

      <!-- Content slot: Added height control for long governance text -->
      <VBox
        v-if="$slots.default"
        class="max-h-48 overflow-y-auto pr-1 scrollbar-thin"
      >
        <slot />
      </VBox>

      <!-- Actions slot: Reserved for primary/secondary action buttons -->
      <VBox v-if="$slots.actions" class="flex justify-end gap-2 pt-1">
        <slot name="actions" />
      </VBox>

    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAlert Component
 * Standardizes governance feedback with controlled content height.
 */
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import { AlertVariant } from '@/interfaces/core';
import { BorderToken, RoundedToken, SpacingToken } from '@/interfaces/layout';


interface Props {
  variant?: AlertVariant;
  border?: BorderToken;
  rounded?: RoundedToken;
  padding?: SpacingToken;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  border: true,
  rounded: 'lg',
  padding: 'md'
});

/**
 * Maps semantic variants to Design Tokens.
 */
const theme = computed(() => {
  const map: Record<AlertVariant, { bg: any, border: string, text: string }> = {
    success: { bg: 'emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    warning: { bg: 'amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    danger: { bg: 'red-50', border: 'border-red-200', text: 'text-rose-700' },
    info: { bg: 'indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
    secondary: { bg: 'slate-50', border: 'border-slate-200', text: 'text-slate-600' }
  };
  return map[props.variant];
});
</script>
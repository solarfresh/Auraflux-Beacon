<template>
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
    <slot />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VAlert Component
 * A functional molecule that maps semantic states to visual tokens.
 * Follows Bootstrap naming conventions for variants.
 */
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';

// Standard Bootstrap/Tailwind semantic variants
type AlertVariant = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface Props {
  /** The semantic intent of the alert */
  variant?: AlertVariant;
  /** Whether to show the border */
  border?: boolean;
  /** Radius of the corners */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  /** Internal spacing */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  border: true,
  rounded: 'lg',
  padding: 'md'
});

/**
 * Maps semantic variants to Design Tokens
 * Logic ensures consistent coloring across all feedback molecules.
 */
const theme = computed(() => {
  const map: Record<AlertVariant, { bg: any, border: string, text: string }> = {
    success: {
      bg: 'emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700'
    },
    warning: {
      bg: 'amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700'
    },
    danger: {
      bg: 'red-50',
      border: 'border-red-200',
      text: 'text-red-700'
    },
    info: {
      bg: 'indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700'
    },
    secondary: {
      bg: 'slate-50',
      border: 'border-slate-200',
      text: 'text-slate-600'
    }
  };
  return map[props.variant];
});
</script>
<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :disabled="disabled"
    :class="[
      // Base Layout: 8px grid alignment (py-2 = 8px)
      'group w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-200',

      // State: Material feel feedback
      'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
      'active:bg-slate-100',

      // Disabled state mapping
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ]"
    @click="$emit('click')"
  >
    <VIcon
      v-if="iconName"
      :name="iconName"
      size="sm"
      class="text-slate-400 group-hover:text-indigo-600 transition-colors"
    />

    <VTypography
      tag="span"
      size="sm"
      weight="medium"
      color="slate-700"
      class="truncate flex-1 group-hover:text-slate-900"
    >
      <slot />
    </VTypography>
  </component>
</template>

<script setup lang="ts">
/**
 * VDropdownItem Atom
 * * A specialized action trigger for menu systems.
 * Integrates VTypography for consistent text rendering.
 */
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

withDefaults(defineProps<{
  /** Heroicon name string */
  iconName?: string;
  /** Vue Router path for navigation */
  to?: string | object;
  /** Disables interaction and applies semantic opacity */
  disabled?: boolean;
}>(), {
  iconName: undefined,
  to: undefined,
  disabled: false,
});

defineEmits(['click']);
</script>
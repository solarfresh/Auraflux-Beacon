<template>
  <button
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      // Variant Mapping
      variantClasses[variant],
      // Size & Shape Mapping
      iconOnly ? iconSizeClasses[size] : textSizeClasses[size],
      // Rounded logic
      iconOnly ? 'rounded-lg' : 'rounded-xl'
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <VIcon v-if="loading" name="ArrowPath" size="sm" class="animate-spin" />

    <template v-else>
      <VIcon
        v-if="iconName"
        :name="iconName"
        :size="size === 'lg' ? 'md' : 'sm'"
        :class="{ 'mr-2': !iconOnly }"
      />

      <VTypography
        v-if="!iconOnly"
        tag="span"
        weight="semibold"
        class="whitespace-nowrap"
        :size="size"
        :color="textColorClasses[variant]"
      >
        <slot />
      </VTypography>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconName?: string;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  iconOnly: false
});

// --- Style Maps ---
const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  tertiary: 'bg-transparent text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  outline: 'bg-transparent border border-gray-200 text-gray-700 hover:border-gray-300',
  ghost: 'bg-transparent text-gray-400 hover:text-gray-600'
};

const textSizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg'
};

const textColorClasses = {
  primary: 'text-white',
  secondary: 'text-indigo-700',
  tertiary: 'text-gray-600',
  danger: 'text-red-600',
  outline: 'text-gray-700',
  ghost: 'text-gray-400'
}

const iconSizeClasses = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2.5',
  lg: 'p-3'
};
</script>
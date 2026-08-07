<template>
  <button
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      // Variant Mapping
      themeStyles.bg,
      themeStyles.text,
      themeStyles.hover,
      themeStyles.border || '',
      // Size & Shape Mapping
      iconOnly ? sizeStyles.iconButton : sizeStyles.control,
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
        :theme="theme"
        :size="size === 'lg' ? 'md' : 'sm'"
        :class="{ 'mr-2': !iconOnly }"
      />

      <VTypography
        v-if="!iconOnly"
        tag="span"
        weight="semibold"
        class="whitespace-nowrap"
        :size="size"
        :theme="theme"
      >
        <slot />
      </VTypography>
    </template>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import type { ThemeToken, SizeToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_SIZE_CLASSES, SHARED_THEME_CLASSES } from '@auraflux/design-system/constants/theme';

export interface VButtonProps {
  type?: 'button' | 'submit' | 'reset';
  theme?: ThemeToken;
  size?: SizeToken;
  iconName?: string;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VButtonProps>(), {
  type: 'button',
  theme: 'primary',
  size: 'md',
  iconOnly: false
});

const sizeStyles = computed(() => {
  return SHARED_SIZE_CLASSES[props.size] || SHARED_SIZE_CLASSES.md;
});

const themeStyles = computed(() => {
  return SHARED_THEME_CLASSES[props.theme] || SHARED_THEME_CLASSES.primary;
});
</script>
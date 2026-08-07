<template>
  <button
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      // Surface Mapping (Visual Properties & Interactive States)
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.border,
      surfaceStyle.hover,
      surfaceStyle.focus,
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
        :size="size === 'lg' ? 'md' : 'sm'"
        :class="{ 'mr-2': !iconOnly }"
      />

      <VTypography
        v-if="!iconOnly"
        tag="span"
        weight="semibold"
        class="whitespace-nowrap"
        :size="size"
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
import type { ComponentSizeToken, AttentionToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { SHARED_COMPONENT_SIZE_CLASSES } from '@auraflux/design-system/constants/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VButtonProps {
  type?: 'button' | 'submit' | 'reset';
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  size?: ComponentSizeToken;
  iconName?: string;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VButtonProps>(), {
  type: 'button',
  attention: 'primary',
  size: 'md',
  iconOnly: false
});

const sizeStyles = computed(() => {
  return SHARED_COMPONENT_SIZE_CLASSES[props.size] || SHARED_COMPONENT_SIZE_CLASSES.md;
});

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});
</script>
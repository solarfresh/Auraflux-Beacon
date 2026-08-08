<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :disabled="disabled"
    :class="[
      surfaceStyle.bg,
      surfaceStyle.text,
      surfaceStyle.hover,
      // Base Layout: 8px grid alignment (py-2 = 8px)
      'group w-full flex items-center gap-3 px-4 py-2 text-left transition-all duration-200',
      // Disabled state mapping
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ]"
    @click="$emit('click')"
  >
    <VIcon
      v-if="iconName"
      :name="iconName"
      size="sm"
      class="transition-colors"
    />

    <VTypography
      tag="span"
      size="sm"
      weight="medium"
      class="truncate flex-1"
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
import { computed } from 'vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import type { AttentionToken, IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

export interface VDropdownItemProps {
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  iconName?: string;
  to?: string | object;
  disabled?: boolean;
}

const props = withDefaults(defineProps<VDropdownItemProps>(), {
  attention: 'secondary',
  iconName: undefined,
  to: undefined,
  disabled: false,
});

defineEmits(['click']);

const surfaceStyle = computed(() => {
  return resolveSurfaceStyle(props.attention, props.intent, props.surface);
});
</script>
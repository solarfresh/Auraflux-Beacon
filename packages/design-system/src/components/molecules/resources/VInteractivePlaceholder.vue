<template>
  <VButton
    :border="border"
    :surface="surface"
    :attention="attention"
    :intent="intent"
    :rounded="rounded"
    :size="size"
    :icon-name="iconName"
    class="w-full h-full flex-col !items-center !justify-center gap-sm group"
  >
    <slot>{{ label }}</slot>
  </VButton>
</template>

<script setup lang="ts">
/**
 * VInteractivePlaceholder
 * A functional molecule used in grids or lists to invite user creation.
 * Refactored to be built on top of VButton[cite: 2, 3].
 *
 * @category Molecules
 * @subcategory Indicators
 */
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import type {
  RoundedToken,
  BorderToken,
  ComponentSizeToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

export interface VInteractivePlaceholderProps {
  /** The name of the icon to display (from the VIcon library).[cite: 2] */
  iconName?: string;
  /** The primary label text. Can also be provided via the default slot.[cite: 2] */
  label?: string;
  border?: BorderToken;
  surface?: SurfaceToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  rounded?: RoundedToken;
  size?: ComponentSizeToken;
};

withDefaults(defineProps<VInteractivePlaceholderProps>(), {
  iconName: 'Plus',
  label: 'Add New Item',
  border: 'dashed',
  surface: 'soft',
  attention: 'secondary',
  rounded: 'xl',
  size: 'lg'
});
</script>
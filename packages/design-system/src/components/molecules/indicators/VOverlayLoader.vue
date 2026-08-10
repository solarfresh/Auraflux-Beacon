<template>
  <VBox
    tag="div"
    padding="xl"
    surface="soft"
    intent="neutral"
    class="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
  >
    <VBox
      :intent="intent"
      surface="base"
      class="mb-6 flex items-center justify-center"
    >
      <VIcon
        :name="iconName"
        :type="iconType"
        :size="iconSize"
        class="animate-spin"
      />
    </VBox>

    <VTypography
      tag="p"
      size="xl"
      weight="bold"
      :intent="intent"
      surface="base"
    >
      {{ message }}
    </VTypography>

    <VTypography
      v-if="detail"
      tag="p"
      size="sm"
      :intent="intent"
      surface="ghost"
      class="mt-2 text-center max-w-xs"
    >
      {{ detail }}
    </VTypography>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import type { ComponentSizeToken, IntentToken } from '@auraflux/design-system/interfaces/theme';

export interface VOverlayLoaderProps {
  /** Primary status message */
  message: string;
  /** Optional secondary info to keep user informed during long waits */
  detail?: string;
  /** Primary visual theme intent (e.g., 'brand', 'neutral', 'info') */
  intent?: IntentToken;
  /** Icon component size */
  iconSize?: ComponentSizeToken;
  /** Icon name in PascalCase or kebab-case */
  iconName?: string;
  /** Icon style variant */
  iconType?: 'solid' | 'outline';
}

withDefaults(defineProps<VOverlayLoaderProps>(), {
  detail: undefined,
  intent: 'brand',
  iconSize: '2xl',
  iconName: 'ArrowPath',
  iconType: 'solid',
});
</script>

<style scoped>
/* Ensuring the spin animation is smooth.
  Note: Tailwind's 'animate-spin' is usually sufficient,
  but keeping local keyframes for specific timing control if needed.
*/
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
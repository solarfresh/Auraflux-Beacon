<template>
  <!-- Main container mapping semantic themes to design tokens -->
  <VBox
    :intent="intent"
    :surface="surface"
    :border="border"
    :rounded="rounded"
    :padding="padding"
    :class="[
      'transition-all duration-300',
    ]"
  >
    <VStack gap="sm">

      <!-- Header slot: Reserved for Alert Icon and Title -->
      <VBox v-if="$slots.header" :intent="intent" :surface="surface" class="flex items-center gap-2">
        <slot name="header" />
      </VBox>

      <!-- Content slot: Added height control for long governance text -->
      <VBox
        v-if="$slots.default"
        :intent="intent"
        :surface="surface"
        class="max-h-48 overflow-y-auto pr-1 scrollbar-thin"
      >
        <slot />
      </VBox>

      <!-- Actions slot: Reserved for primary/secondary action buttons -->
      <VBox v-if="$slots.actions" :intent="intent" :surface="surface" class="flex justify-end gap-2 pt-1">
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
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type {SpacingToken, RoundedToken, BorderToken, IntentToken, SurfaceToken} from '@auraflux/design-system/interfaces/theme';

export interface VAlertProps {
  intent?: IntentToken;
  surface?: SurfaceToken;
  border?: BorderToken;
  rounded?: RoundedToken;
  padding?: SpacingToken;
}

const props = withDefaults(defineProps<VAlertProps>(), {
  intent: 'info',
  surface: 'soft',
  border: 'all',
  rounded: 'lg',
  padding: 'md'
});
</script>
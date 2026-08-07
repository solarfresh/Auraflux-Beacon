<template>
  <!-- Main container mapping semantic themes to design tokens -->
  <VBox
    :theme="theme"
    :border="border"
    :rounded="rounded"
    :padding="padding"
    :class="[
      'transition-all duration-300',
    ]"
  >
    <VStack gap="sm">

      <!-- Header slot: Reserved for Alert Icon and Title -->
      <VBox v-if="$slots.header" :theme="theme" class="flex items-center gap-2">
        <slot name="header" />
      </VBox>

      <!-- Content slot: Added height control for long governance text -->
      <VBox
        v-if="$slots.default"
        :theme="theme"
        class="max-h-48 overflow-y-auto pr-1 scrollbar-thin"
      >
        <slot />
      </VBox>

      <!-- Actions slot: Reserved for primary/secondary action buttons -->
      <VBox v-if="$slots.actions" :theme="theme" class="flex justify-end gap-2 pt-1">
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
import type {SpacingToken, RoundedToken, BorderToken, ThemeToken} from '@auraflux/design-system/interfaces/theme';

export interface VAlertProps {
  theme?: ThemeToken;
  border?: BorderToken;
  rounded?: RoundedToken;
  padding?: SpacingToken;
}

const props = withDefaults(defineProps<VAlertProps>(), {
  theme: 'info',
  border: 'all',
  rounded: 'lg',
  padding: 'md'
});
</script>
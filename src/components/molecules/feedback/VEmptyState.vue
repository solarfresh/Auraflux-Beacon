<template>
  <VStack
    full-height
    align="center"
    justify="center"
    gap="lg"
    background="slate-50"
    class="opacity-90 transition-opacity duration-300"
  >
    <VBox
      padding="lg"
      background="white"
      rounded="2xl"
      border="all"
      class="shadow-sm border-slate-200"
    >
      <VIcon
        :name="icon"
        size="lg"
        class="text-slate-300"
      />
    </VBox>

    <VStack gap="xs" align="center" class="max-w-xs text-center">
      <VTypography
        tag="h3"
        size="lg"
        weight="semibold"
        color="slate-900"
      >
        {{ title }}
      </VTypography>

      <VTypography
        size="sm"
        color="slate-500"
        class="leading-relaxed"
      >
        <slot>{{ description }}</slot>
      </VTypography>
    </VStack>

    <slot name="actions" />
  </VStack>
</template>

<script setup lang="ts">
/**
 * VEmptyState Component
 * A reusable layout for empty panel states, lists, or search results.
 */
import VStack from '@/components/atoms/layout/VStack.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface Props {
  /** Heroicon name to display */
  icon?: string;
  /** Primary headline */
  title: string;
  /** Secondary guidance text */
  description?: string;
}

withDefaults(defineProps<Props>(), {
  icon: 'Inbox'
});
</script>
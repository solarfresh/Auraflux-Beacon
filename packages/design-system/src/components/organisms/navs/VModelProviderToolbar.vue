<template>
  <VToolbar
    :sticky="sticky"
    :intent="intent"
    :surface="surface"
    :border="border"
    :padding="padding"
    class="border-b border-slate-200/80 px-6 py-4"
  >
    <template #start>
      <VStack gap="none">
        <VTypography tag="h1" size="lg" weight="bold" class="text-slate-900">
          {{ title }}
        </VTypography>
        <VTypography tag="p" size="xs" intent="neutral" surface="ghost">
          {{ description }}
        </VTypography>
      </VStack>
    </template>

    <template #end>
      <VButton
        attention="primary"
        rounded="md"
        size="sm"
        class="flex items-center gap-1.5"
        @click="$emit('create')"
      >
        <VIcon name="Plus" size="sm" />
        <VTypography tag="span" size="sm" weight="medium">
          Add Provider
        </VTypography>
      </VButton>
    </template>
  </VToolbar>
</template>

<script setup lang="ts">
/**
 * VModelProviderToolbar
 * An organism toolbar specialized for ModelProvider management page headers.
 */
import VToolbar from '@auraflux/design-system/components/organisms/layout/VToolbar.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

import type {
  BorderToken,
  IntentToken,
  SpacingToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';

export interface VModelProviderToolbarProps {
  title?: string;
  description?: string;
  sticky?: boolean;
  intent?: IntentToken;
  surface?: SurfaceToken;
  border?: BorderToken;
  padding?: SpacingToken;
}

withDefaults(defineProps<VModelProviderToolbarProps>(), {
  title: 'Model Providers',
  description: 'Configure LLM API credentials, endpoints, and monitor operational health.',
  sticky: true,
  intent: 'neutral',
  surface: 'base',
  border: 'none',
  padding: 'none',
});

defineEmits<{
  (e: 'create'): void;
}>();
</script>
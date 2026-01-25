<template>
  <Stack gap="xs" v-bind="$attrs" class="w-full">
    <Cluster v-if="label" justify="between" align="center">
      <Text
        tag="label"
        :for="id"
        size="sm"
        weight="bold"
        color="gray-700"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </Text>

      <slot name="hint" />
    </Cluster>

    <Box padding="none" class="relative">
      <slot :id="id" :is-disabled="disabled" />

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-1 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
      >
        <Text
          v-if="error"
          size="xs"
          color="red-500"
          class="mt-1 ml-1"
        >
          {{ error }}
        </Text>
      </transition>
    </Box>

    <Text
      v-if="description && !error"
      size="xs"
      color="gray-400"
      class="ml-1"
    >
      {{ description }}
    </Text>
  </Stack>
</template>

<script setup lang="ts">
/**
 * FormField (Molecule)
 * A structural wrapper for form controls to ensure consistent
 * labeling, error states, and spacing across the application.
 */
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
import Text from '@/components/atoms/data-display/Text.vue';

interface Props {
  /** Unique ID for the input/label association */
  id: string;
  /** Primary label text */
  label?: string;
  /** Brief description shown below the input */
  description?: string;
  /** Error message that replaces description when present */
  error?: string;
  /** Whether the field is mandatory */
  required?: boolean;
  /** Propagates disabled state to visual layers */
  disabled?: boolean;
}

defineProps<Props>();

// Disable attribute inheritance to prevent classes bleeding onto the Stack
defineOptions({
  inheritAttrs: false
});
</script>
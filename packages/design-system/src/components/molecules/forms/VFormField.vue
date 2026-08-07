<template>
  <VStack gap="xs" v-bind="$attrs" class="w-full">
    <VCluster v-if="label" justify="between" align="center">
      <VTypography
        tag="label"
        :for="id"
        size="sm"
        weight="bold"
      >
        {{ label }}
        <VTypography tag="span" v-if="required" theme="danger" class="ml-0.5">*</VTypography>
      </VTypography>

      <slot name="hint" />
    </VCluster>

    <VBox padding="none" class="relative">
      <slot :id="id" :is-disabled="disabled" />

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-1 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
      >
        <VTypography
          v-if="error"
          size="xs"
          theme="danger"
          class="mt-1 ml-1"
        >
          {{ error }}
        </VTypography>
      </transition>
    </VBox>

    <VTypography
      v-if="description && !error"
      size="xs"
      theme="ghost"
      class="ml-1"
    >
      {{ description }}
    </VTypography>
  </VStack>
</template>

<script setup lang="ts">
/**
 * FormField (Molecule)
 * A structural wrapper for form controls to ensure consistent
 * labeling, error states, and spacing across the application.
 */
import { v4 as uuidv4 } from 'uuid';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

export interface VFormFieldProps {
  /** Unique ID for the input/label association */
  id?: string;
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

withDefaults(defineProps<VFormFieldProps>(), {id: `form-field-${uuidv4()}`});

// Disable attribute inheritance to prevent classes bleeding onto the Stack
defineOptions({
  inheritAttrs: false
});
</script>
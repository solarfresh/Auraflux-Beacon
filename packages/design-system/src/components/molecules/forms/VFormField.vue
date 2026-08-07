<template>
  <VStack gap="xs" v-bind="$attrs" class="w-full">
    <!-- Header: Label & Hint Slot -->
    <VCluster v-if="label" justify="between" align="center">
      <VTypography
        tag="label"
        :for="id"
        size="sm"
        weight="bold"
      >
        {{ label }}
        <VTypography tag="span" v-if="required" intent="danger" class="ml-0.5">*</VTypography>
      </VTypography>

      <slot name="hint" />
    </VCluster>

    <!-- Input Control Slot Container -->
    <VBox padding="none" class="relative">
      <slot
        :id="id"
        :is-disabled="disabled"
        :is-invalid="Boolean(error)"
        :aria-describedby="describedByIds"
      />
    </VBox>

    <!-- Error Message with Smooth Transition -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
    >
      <VTypography
        v-if="error"
        :id="errorId"
        size="xs"
        intent="danger"
        class="ml-1 mt-0.5"
      >
        {{ error }}
      </VTypography>
    </transition>

    <!-- Helper Description -->
    <VTypography
      v-if="description && !error"
      :id="descriptionId"
      size="xs"
      attention="secondary"
      class="ml-1 mt-0.5"
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
import { computed, useId } from 'vue';

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

const props = defineProps<VFormFieldProps>();

// Disable attribute inheritance to prevent classes bleeding onto the Stack
defineOptions({
  inheritAttrs: false
});

// Use Vue 3.5+ native useId() for SSR-safe unique ID generation, fallback to prop
const autoId = useId();
const id = computed(() => props.id || `form-field-${autoId}`);

// ARIA helper IDs for screen readers
const errorId = computed(() => `${id.value}-error`);
const descriptionId = computed(() => `${id.value}-description`);

const describedByIds = computed(() => {
  if (props.error) return errorId.value;
  if (props.description) return descriptionId.value;
  return undefined;
});
</script>
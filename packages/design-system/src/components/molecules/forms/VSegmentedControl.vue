<template>
  <VBox
    :attention="attention"
    :intent="intent"
    :surface="surface"
    class="inline-flex items-center select-none"
    role="tablist"
    @keydown="handleKeyDown"
  >
    <VButton
      v-for="option in options"
      :key="String(option.value)"
      role="tab"
      size="sm"
      :padding="padding"
      :rounded="rounded"
      :border="border"
      :attention="modelValue === option.value ? 'primary' : 'tertiary'"
      :surface="modelValue === option.value ? 'solid' : 'ghost'"
      :icon="option.iconName"
      :disabled="option.disabled"
      :aria-selected="modelValue === option.value"
      :tabindex="modelValue === option.value ? 0 : -1"
      class="transition-all duration-200"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </VButton>
  </VBox>
</template>

<script setup lang="ts" generic="T extends string | number">
/**
 * VSegmentedControl
 * Molecule / Form Component
 * A segmented control built with VBox and VButton Atoms to toggle between exclusive options.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import type {
  SpacingToken,
  RoundedToken,
  BorderToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

export interface SegmentedOption<TValue = string | number> {
  label: string;
  value: TValue;
  iconName?: string;
  disabled?: boolean;
}

export interface VSegmentedControlProps<TValue> {
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  modelValue: TValue;
  options: ReadonlyArray<SegmentedOption<TValue>>;
}

const props = withDefaults(defineProps<VSegmentedControlProps<T>>(), {
  padding: 'none',
  rounded: 'sm',
  border: 'none',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
  (e: 'change', value: T): void;
}>();

const selectOption = (value: T) => {
  if (props.modelValue !== value) {
    emit('update:modelValue', value);
    emit('change', value);
  }
};

// Keyboard Navigation for Tablist a11y compliance
const handleKeyDown = (event: KeyboardEvent) => {
  const enabledOptions = props.options.filter((opt) => !opt.disabled);
  if (enabledOptions.length === 0) return;

  const currentIndex = enabledOptions.findIndex((opt) => opt.value === props.modelValue);
  let nextIndex = currentIndex;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    nextIndex = (currentIndex + 1) % enabledOptions.length;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    nextIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
  } else if (event.key === 'Home') {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    nextIndex = enabledOptions.length - 1;
  }

  if (nextIndex !== currentIndex && enabledOptions[nextIndex]) {
    selectOption(enabledOptions[nextIndex].value);
  }
};
</script>
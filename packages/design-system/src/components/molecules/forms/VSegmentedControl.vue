<template>
  <VBox
    surface="subtle"
    padding="xs"
    rounded="xl"
    class="inline-flex items-center select-none"
    role="tablist"
  >
    <VButton
      v-for="option in options"
      :key="String(option.value)"
      role="tab"
      size="sm"
      :variant="modelValue === option.value ? 'secondary' : 'ghost'"
      :icon-name="option.iconName"
      :disabled="option.disabled"
      :aria-selected="modelValue === option.value"
      :class="[
        // Base transition
        'transition-all duration-200',

        // Active state override for active pill indicator
        modelValue === option.value
          ? 'bg-white text-slate-800 shadow-sm font-semibold hover:bg-white'
          : 'text-slate-500 hover:text-slate-700'
      ]"
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

export interface SegmentedOption<TValue = string | number> {
  label: string;
  value: TValue;
  iconName?: string;
  disabled?: boolean;
}

export interface VSegmentedControlProps<TValue> {
  modelValue: TValue;
  options: ReadonlyArray<SegmentedOption<TValue>>;
}

const props = defineProps<VSegmentedControlProps<T>>();

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
</script>
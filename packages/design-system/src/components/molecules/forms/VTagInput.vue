<template>
  <VStack gap="sm">
    <VCluster v-if="modelValue.length > 0" gap="xs" wrap>
      <VChip
        :padding="padding"
        :rounded="rounded"
        :border="border"
        :attention="attention"
        :intent="intent"
        :surface="surface"
        :size="size"
        v-for="(tag, index) in modelValue"
        :key="index"
        :label="tag"
        @click="removeTag(index)"
      />
    </VCluster>

    <VInput
      v-model="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown="handleKeydown"
      @blur="addTag"
    />
  </VStack>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VChip from '@auraflux/design-system/components/molecules/indicators/VChip.vue';
import type {
  SpacingToken,
  RoundedToken,
  BorderToken,
  AttentionToken,
  IntentToken,
  SurfaceToken,
  ComponentSizeToken
} from '@auraflux/design-system/interfaces/theme';

export interface VTagInputProps {
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  size?: ComponentSizeToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  modelValue: string[];
  placeholder?: string;
  disabled?: boolean;
};

const props = withDefaults(defineProps<VTagInputProps>(), {
  padding: 'sm',
  rounded: 'xl',
  border: 'all',
  attention: 'secondary',
  size: 'sm',
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');

const addTag = () => {
  const tag = inputValue.value.trim();
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag]);
  }
  inputValue.value = '';
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addTag();
  }
};

const removeTag = (index: number) => {
  const newTags = [...props.modelValue];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
};
</script>
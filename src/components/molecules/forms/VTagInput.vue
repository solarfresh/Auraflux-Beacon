<template>
  <VStack gap="sm">
    <VCluster v-if="modelValue.length > 0" gap="xs" wrap>
      <VEntityChip
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
import VInput from '@/components/atoms/forms/VInput.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VEntityChip from '@/components/molecules/resources/VEntityChip.vue';

const props = defineProps<{
  modelValue: string[];
  placeholder?: string;
  disabled?: boolean;
}>();

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
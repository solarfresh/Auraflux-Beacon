<template>
  <div
    class="focus-item group cursor-pointer hover:bg-blue-50 p-2 rounded transition-all border-b border-dashed border-transparent hover:border-blue-300"
    @click="$emit('click')"
  >
    <Text
      tag="span"
      size="xs"
      weight="medium"
      color="blue-700"
    >
      {{ label }}:
    </Text>

    <Text
      tag="p"
      size="sm"
      weight="normal"
      color="gray-800"
      class="mt-0.5 line-clamp-2 leading-relaxed"
    >
      {{ value || placeholder }}
    </Text>

    <div class="flex justify-end mt-1 h-4">
      <Text
        tag="span"
        size="xs"
        weight="medium"
        color="blue-500"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Edit
      </Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';

defineProps<{
  label: string;
  value?: string;
  placeholder: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
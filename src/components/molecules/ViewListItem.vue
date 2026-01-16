<template>
  <li
    @click="$emit('select')"
    :class="[
      'group flex items-center justify-between p-2 rounded cursor-pointer transition-all border text-sm',
      isActive
        ? 'bg-blue-50 border-blue-200 shadow-sm'
        : 'bg-transparent border-transparent hover:bg-gray-50'
    ]"
  >
    <div class="flex items-center min-w-0 flex-1">
      <Text
        tag="span"
        size="sm"
        :weight="isActive ? 'semibold' : 'normal'"
        :color="isActive ? 'blue-800' : 'gray-700'"
        class="truncate"
      >
        {{ name }}
      </Text>
      <Text
        v-if="isActive"
        tag="span"
        size="xs"
        color="blue-500"
        class="ml-2 shrink-0 font-medium"
      >
        (Active)
      </Text>
    </div>

    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
      </div>
  </li>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';

defineProps<{
  name: string;
  isActive: boolean;
}>();

defineEmits<{
  (e: 'select'): void;
}>();
</script>
<template>
  <div class="flex flex-col space-y-1">
    <div class="flex justify-between items-center group">
      <Text
        tag="span"
        size="xs"
        weight="semibold"
        :color="color"
        class="flex items-center cursor-pointer hover:underline"
        @click="$emit('navigate')"
      >
        {{ label }}
      </Text>
      <Text tag="span" size="xs" color="gray-500" weight="normal">
        {{ count }}
      </Text>
    </div>

    <Text
      v-if="count === 0"
      tag="p"
      size="xs"
      color="gray-400"
      class="italic pl-1"
    >
      No {{ label.toLowerCase() }} defined.
    </Text>
  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';

defineProps<{
  label: string;
  count: number;
  color: string;
}>();

defineEmits<{
  (e: 'navigate'): void;
}>();
</script>
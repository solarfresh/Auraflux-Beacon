<template>
  <div class="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center p-8">

    <Icon
      name="ArrowPath"
      type="solid"
      size="2xl"
      color="indigo-600"
      class="animate-spin mb-4"
    />

    <Text tag="p" size="xl" weight="medium" color="indigo-600">
      {{ message }}
    </Text>

    <Text v-if="detail" tag="p" size="sm" color="gray-500" class="mt-2">
      {{ detail }}
    </Text>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

defineProps<{
  /**
   * The main message displayed to the user (e.g., "Loading application...").
   */
  message: {
    type: String,
    required: true,
  };

  /**
   * Optional secondary detail or context (e.g., "Authenticating user").
   */
  detail?: string;
}>();
</script>

<style scoped>
/* Scoped styles primarily use Tailwind classes for layout and appearance */

/* Animation for the spinner icon */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
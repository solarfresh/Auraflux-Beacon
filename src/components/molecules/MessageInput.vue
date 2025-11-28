<template>
  <div class="flex space-x-3 items-end">

    <Input
      type="text"
      v-model="inputContent"
      @keyup.enter="handleSend"
      placeholder="Type your question or statement..."
      :disabled="isDisabled"
      size="lg"
      class="flex-1"
    />

    <Button
      @click="handleSend"
      :disabled="isDisabled || !inputContent.trim()"
      variant="primary"
      size="lg"
      class="flex-shrink-0"
      aria-label="Send message"
    >
      <Icon name="PaperAirplane" type="solid" size="md" color="white" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '@/components/atoms/Input.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';

const props = defineProps({
  /**
   * Disables the input field and send button when the agent is typing or busy.
   */
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  /**
   * Emitted when the user successfully sends a message.
   * @param content - The text content of the message.
   */
  (e: 'sendMessage', content: string): void;
}>();

const inputContent = ref('');

const handleSend = () => {
  const content = inputContent.value.trim();

  if (content && !props.isDisabled) {
    // 1. Emit the message content
    emit('sendMessage', content);

    // 2. Clear the local input state
    inputContent.value = '';
  }
};
</script>
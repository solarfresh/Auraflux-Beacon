<template>
  <div class="flex space-x-3 items-end w-full">
    <Input
      v-model="inputContent"
      type="text"
      placeholder="Type your question or statement..."
      :disabled="isDisabled"
      size="lg"
      class="flex-1"
      @keyup.enter="handleSend"
    />

    <Button
      variant="primary"
      size="lg"
      class="flex-shrink-0"
      :disabled="isDisabled || !inputContent.trim()"
      aria-label="Send message"
      @click="handleSend"
    >
      <Icon name="PaperAirplane" type="solid" size="md" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '@/components/atoms/Input.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/Icon.vue';

/**
 * MessageInput Molecule
 * A composite component for message entry in chat interfaces.
 * Combines Input and Button atoms with localized sending logic.
 */
const props = defineProps({
  /** Prevents interaction during processing states */
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  /**
   * Fires when a valid message is submitted.
   * @param content The trimmed string content.
   */
  (e: 'sendMessage', content: string): void;
}>();

const inputContent = ref('');

/** Handles validation and emission of the message */
const handleSend = () => {
  const content = inputContent.value.trim();

  if (content && !props.isDisabled) {
    emit('sendMessage', content);
    inputContent.value = ''; // Reset input after successful emission
  }
};
</script>
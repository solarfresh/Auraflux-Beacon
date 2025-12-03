<template>
  <div class="flex flex-col h-full bg-white relative">

    <div
      ref="chatHistoryRef"
      class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{'flex justify-end': message.type === 'user', 'flex justify-start': message.type === 'agent'}"
      >
        <div
          class="max-w-xl p-4 rounded-xl shadow-md"
          :class="{
            'bg-indigo-600 text-white rounded-br-none': message.type === 'user',
            'bg-gray-100 text-gray-800 rounded-tl-none': message.type === 'agent'
          }"
        >
          <Text tag="p" size="base" color="current">
            {{ message.content }}
          </Text>
        </div>
      </div>

      <div v-if="isTyping" class="flex justify-start">
        <div class="max-w-xl p-4 rounded-xl bg-gray-100 text-gray-800 rounded-tl-none shadow-md">
          <Text tag="p" size="base" color="gray-500">
            Agent is typing...
          </Text>
        </div>
      </div>

    </div>

    <div class="flex-shrink-0 border-t p-4 bg-gray-50">
      <MessageInput
        @send-message="$emit('sendMessage', $event)"
        :is-disabled="isTyping"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/Text.vue';
import MessageInput from '@/components/molecules/MessageInput.vue';
import { ChatMessage } from '@/interfaces/workflow';
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  /**
   * Array of chat messages to display.
   */
  messages: ChatMessage[];
}>();

const emit = defineEmits<{
  /**
   * Emitted when the user submits a message via the input box.
   */
  (e: 'sendMessage', content: string): void;
}>();

// --- Local State ---
const chatHistoryRef = ref<HTMLDivElement | null>(null);
// Note: isTyping is kept here to control the MessageInput state and show the typing indicator
const isTyping = ref(false);

// --- Watcher for Auto-Scrolling ---
watch(() => props.messages.length, () => {
  // Mock Agent Typing state update (This simulates agent thinking after a user message)
  // In a real app, this would be managed by a global state/store based on API response status.
  const lastMessage = props.messages[props.messages.length - 1];
  if (lastMessage && lastMessage.type === 'user') {
    isTyping.value = true;
    setTimeout(() => {
      isTyping.value = false;
    }, 1000);
  }

  nextTick(() => {
    if (chatHistoryRef.value) {
      // Scroll to the bottom whenever a new message is added
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
    }
  });
}, { immediate: true });
</script>

<style scoped>
/* Scoped styles specific to the chat interface layout */
</style>
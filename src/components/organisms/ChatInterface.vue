<template>
  <div class="flex flex-col h-full bg-white relative">

    <div
      ref="chatHistoryRef"
      class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{'flex justify-end': message.role === 'user', 'flex justify-start': message.role === 'system'}"
      >
        <div
          class="max-w-xl p-4 rounded-xl shadow-md"
          :class="{
            'bg-indigo-600 text-white rounded-br-none': message.role === 'user',
            'bg-gray-100 text-gray-800 rounded-tl-none': message.role === 'system'
          }"
        >
          <template v-if="message.role === 'system'">
            <MarkdownRenderer :content="message.content" class="text-gray-800" />
          </template>

          <template v-else>
            <Text tag="p" size="base" color="current">
              {{ message.content }}
            </Text>
          </template>
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
import MarkdownRenderer from '@/components/atoms/MarkdownRenderer.vue';
import Text from '@/components/atoms/Text.vue';
import MessageInput from '@/components/molecules/actions/MessageInput.vue';
import { ChatMessage } from '@/interfaces/core';
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  /**
   * Array of chat messages to display.
   */
  messages: ChatMessage[];
  isTyping: boolean;
}>();

const emit = defineEmits<{
  /**
   * Emitted when the user submits a message via the input box.
   */
  (e: 'sendMessage', content: string): void;
}>();

// --- Local State ---
const chatHistoryRef = ref<HTMLDivElement | null>(null);

// --- Watcher for Auto-Scrolling ---
watch(() => props.messages.length, () => {
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
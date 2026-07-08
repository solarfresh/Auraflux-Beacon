import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';

import type {
  ChatMessage
} from '@/interfaces/core';

export const useConsultationStore = defineStore('consultation', () => {
  // --- State (Refs) ---

  /** The list of all chat messages in the initiation stage. */
  const chatMessages = ref<ChatMessage[]>([]);

  /** Flag to indicate if a message is in recieving. */
  const isTyping = ref(false);

  // --- Getters (Computed) ---

  // --- Actions (Functions) ---

  /**
   * Adds a new message to the chat history.
   */
  async function addMessage(messageContent: string, agentName: string) {
    isTyping.value = true;
    chatMessages.value.push({
      id: uuidv4(),
      role: 'user',
      content: messageContent,
      name: 'User',
      timestamp: new Date().toISOString(),
      sequenceNumber: chatMessages.value.length + 1,
    } as ChatMessage); // Type assertion for strict compliance
    chatMessages.value.push({
      id: uuidv4(),
      role: 'system',
      content: 'Agent is typing...',
      name: agentName,
      timestamp: new Date().toISOString(),
      sequenceNumber: chatMessages.value.length + 2,
    } as ChatMessage);
  }

  async function setMessages(messages: ChatMessage[]) {
    chatMessages.value = messages;
  }

  // --- Return public API ---
  return {
    // State
    chatMessages,
    isTyping,
    // Getters
    // Actions
    addMessage,
    setMessages,
  };
})

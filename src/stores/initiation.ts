import { apiService } from '@/api/apiService';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import type {
  ChatMessage
} from '@/interfaces/initiation';

export const useInitiativeStore = defineStore('intiation', () => {
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
    async function addMessage(messageContent: string) {
        const agentName = 'ExplorerAgent';
        isTyping.value = true;
        chatMessages.value.push({
            id: uuidv4(),
            role: 'user',
            content: messageContent,
						name: 'User',
            timestamp: new Date().toISOString(),
            sequence_number: chatMessages.value.length + 1,
        } as ChatMessage); // Type assertion for strict compliance
        chatMessages.value.push({
          id: uuidv4(),
          role: 'system',
          content: 'Agent is typing...',
          name: agentName,
          timestamp: new Date().toISOString(),
          sequence_number: chatMessages.value.length + 2,
        } as ChatMessage);
        apiService.workflows.initiation.chat(messageContent, agentName);
    }

    async function getMessages() {
      let response = await apiService.workflows.initiation.getChatHistory();
      if (response) {
        chatMessages.value = response.data;
      }
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
				isTyping,
        // Getters
        // Actions
        addMessage,
        getMessages,
    };
})

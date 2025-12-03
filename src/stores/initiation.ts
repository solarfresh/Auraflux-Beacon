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
						name: 'User'
        } as ChatMessage); // Type assertion for strict compliance
        chatMessages.value.push({
          id: uuidv4(),
          role: 'system',
          content: 'Agent is typing...',
          name: agentName
        } as ChatMessage);
        apiService.workflows.initiation.chat(messageContent, agentName);
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
				isTyping,
        // Getters
        // Actions
        addMessage,
    };
})

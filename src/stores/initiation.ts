import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
    ChatMessage
} from '@/interfaces/initiation';

export const useInitiativeStore = defineStore('intiation', () => {
    // --- State (Refs) ---

    /** The list of all chat messages in the initiation stage. */
    const chatMessages = ref<ChatMessage[]>([]);

		/** Flag to indicate if a message is in recieving. */
    const isLoading = ref(false);

		// --- Getters (Computed) ---
		// --- Actions (Functions) ---

    /**
     * Adds a new message to the chat history.
     */
    function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: number }) {
        chatMessages.value.push({
            id: message.id || Date.now(), // Use provided ID or generate one
            role: message.role,
            content: message.content,
						name: message.name
        } as ChatMessage); // Type assertion for strict compliance
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
				isLoading,
        // Getters
        // Actions
        addMessage,
    };
})

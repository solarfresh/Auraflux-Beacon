import {
	ExplorationState,
} from '@/interfaces/exploration';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useExplorationStore = defineStore('exploration', {
	state: (): ExplorationState => ({
		canvasView: { canvasId: '', nodes: new Map(), edges: [] },
		selectedNodeId: '',

		chatMessages: [],
		isTyping: false,
		aiSearchSuggestions: [],
		hasUnreadAIChat: false,
	}),

	getters: {
	},

	actions: {
		addMessage(content: string, isUser: boolean = true) {
			this.chatMessages.push({
				id: uuidv4(),
				role: 'system',
				content: content,
				isUser: isUser,
				timestamp: new Date().toISOString(),
				sequenceNumber: 0
			});
			// Mark unread only if it's an AI response
			if (!isUser) {
				this.hasUnreadAIChat = true;
			}
		},

		markAIChatAsRead() {
			this.hasUnreadAIChat = false; // (U.S. 10)
		},

		async getAgentResponse(userMessage: string) {
			this.isTyping = true;
			this.aiSearchSuggestions = []; // Clear old suggestions

			// Simulate API call to AI agent (U.S. 11)
			await new Promise(resolve => setTimeout(resolve, 1500));

			const responseContent = this.getSimulatedAIResponse(userMessage);

			// Add AI's response to chat
			this.addMessage(responseContent, false);

			this.isTyping = false;
		},

		// Placeholder for AI logic
		getSimulatedAIResponse(userMessage: string): string {
			return `That's an interesting point about "${userMessage}". Based on your current structure, have you considered the **Causal Link** between Concept A and Resource B?`;
		}
	},
});


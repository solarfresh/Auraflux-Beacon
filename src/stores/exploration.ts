import { ConceptualNode, NodeType } from '@/interfaces/conceptual-map';
import type { SidebarRegistryInfo } from '@/interfaces/exploration';
import {
	ExplorationState,
} from '@/interfaces/exploration';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useExplorationStore = defineStore('exploration', {
	state: (): ExplorationState => ({
		stabilityScore: 10,

		canvasView: { canvasId: '', nodes: new Map(), edges: [] },
		activeCanvasId: '',
		selectedNodeId: '',
		sidebarNodes: new Map(),

		chatMessages: [],
		isTyping: false,
		aiSearchSuggestions: [],
		hasUnreadAIChat: false,

		reflectionLogs: [],
		isExplorationSufficient: false,
	}),

	getters: {
	},

	actions: {
		async setSidebarRegistryInfo(info: SidebarRegistryInfo) {
			this.stabilityScore = info.stabilityScore;

			// TODO: The data model of final question must be defined
			this.sidebarNodes.set('focusQuestion', {
				id: 'focusQuestion',
				label: info.finalQuestion,
				type: 'FOCUS' as NodeType,
			})

			this.activeCanvasId = info.activeCanvasId;

			info.nodes.map((node: ConceptualNode) => {
				this.sidebarNodes.set(node.id, node);
			});
		},

		// --- Multi-Canvas Management (U.S. 2, 3) ---

		/** Switches the active canvas view and loads its data */
		async setActiveCanvasView(viewId: string) {
			if (this.activeCanvasId === viewId) return;

			// 1. Save current view's nodes/edges (critical step)
			// SaveNodesAndEdges(this.activeCanvasViewId, this.conceptualNodes, this.conceptualEdges);

			this.activeCanvasId = viewId;
			// 2. Load new view's data
			// this.conceptualNodes = await api.fetchData(`/exploration/canvas/${viewId}/nodes`);
			// this.conceptualEdges = await api.fetchData(`/exploration/canvas/${viewId}/edges`);

			// For now, simulating load:
			// this.conceptualNodes = [];
			// this.conceptualEdges = [];
		},

		// --- AI Interaction (U.S. 10, 11) ---

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


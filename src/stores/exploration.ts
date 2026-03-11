import { apiService } from '@/api/apiService';
import { POSITION_SCALE } from '@/constants/canvases';
import { ConceptualEdge, ConceptualNode, NodeType } from '@/interfaces/conceptual-map';
import {
	ExplorationState,
	NodeSummary
} from '@/interfaces/exploration';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useExplorationStore = defineStore('exploration', {
	state: (): ExplorationState => ({
		stabilityScore: 10,

		isDragging: false,
	  isDragOver: false,
	  draggedNode: null,

		resources: [],
		canvasView: {nodes: new Map(), edges: []},
		activeCanvasId: '',
		selectedNodeId: '',
		sidebarNodes: new Map(),
		conceptualNodes: new Map(),
		conceptualEdges: [],

		chatMessages: [],
		isTyping: false,
		aiSearchSuggestions: [],
		hasUnreadAIChat: false,

		reflectionLogs: [],
		isExplorationSufficient: false,
	}),

	getters: {
		/**
		 * Returns a summarized count of node types for the active canvas,
		 * used by the CanvasStructureSidebar for the index (U.S. 12).
		 */
		currentNodeSummary: (state): NodeSummary => {
				const summary: NodeSummary = { insight: 0, query: 0, resource: 0, group: 0 };
				state.conceptualNodes.forEach(node => {
						if (node.type in summary) {
								summary[node.type as keyof NodeSummary]++;
						}
				});
				return summary;
		},

		// Placeholder for calculating exploration completeness
		isExplorationComplete: (state) => {
				// Logic should check node count, resource count, and reflection frequency
				return state.resources.length > 5 && state.conceptualNodes.size > 10;
		},
	},

	actions: {
		// --- Initialization & Loading ---
		async loadExplorationData() {
			// Simulate loading data for the current active view and resources
			// This would typically involve API calls to fetch: resources, nodes, edges, chat history
			try {
				await this.loadSidebarRegistryInfo();
				await this.loadCanvasView();
			} catch (error) {
				console.error('Failed to load exploration data:', error);
			}
		},

		async loadCanvasView() {
			try {
				let response = await apiService.canvases.graphs.get(this.activeCanvasId);
				if (response.data) {
					Object.entries(response.data.nodes).map(([key, value]) => {
						value.position.x *= POSITION_SCALE;
						value.position.y *= POSITION_SCALE;
						this.conceptualNodes.set(key, value);
					});
					this.conceptualEdges = response.data.edges;
				} else {
					console.log(response.data);
				}
			} catch (error) {
				console.error('Failed to load exploration data:', error);
			}
		},

		async loadSidebarRegistryInfo() {
			try {
				let response = await apiService.workflows.exploration.getSidebarRegistryInfo();
				if (response.data) {
					this.stabilityScore = response.data.stabilityScore;

					// TODO: The data model of final question must be defined
					this.sidebarNodes.set('focusQuestion', {
						id: 'focusQuestion',
						label: response.data.finalQuestion,
						groundedness: 10,
						solidity: 'SOLID',
						type: 'FOCUS' as NodeType,
					})

					this.activeCanvasId = response.data.activeCanvasId;

					response.data.nodes.map((node: ConceptualNode) => {
						this.sidebarNodes.set(node.id, node);
					});
				} else {
					console.log(response.data);
				}
			} catch (error) {
				console.error('Failed to load exploration data:', error);
			}
		},

		async updateConeptualNode(node: ConceptualNode) {
			try {
				if (node.position) {
					node.position.x /= POSITION_SCALE;
					node.position.y /= POSITION_SCALE;
				}

				let response = await apiService.canvases.nodes.update(this.activeCanvasId, node.id, node);
				if (response.data) {
					let node = response.data;
					this.conceptualNodes.set(node.id, node);
				}
			} catch (error) {
				console.error('Failed to update node:', error);
			}
		},

		/** Handles updates for existing nodes, including moving, grouping, and editing */
		updateConceptualMapNode(node: ConceptualNode, action: 'move' | 'link' | 'edit' | 'delete' | 'group') {
			if (action === 'delete') {
				this.conceptualNodes.delete(node.id);
				// Also delete related edges
				this.conceptualEdges = this.conceptualEdges.filter(e => e.source !== node.id && e.target !== node.id);
			} else if (action === 'group') {
				// Logic to create or update a Group Node (U.S. 7)
			} else {
				this.conceptualNodes.set(node.id, node);
			}
		},

		/** Handles edge creation, deletion, and label editing (U.S. 8) */
		updateConceptualMapEdge(edge: ConceptualEdge, action: 'create' | 'delete' | 'update' | 'label-edit') {
			if (action === 'create' || action === 'update' || action === 'label-edit') {
				const existingIndex = this.conceptualEdges.findIndex(e => e.id === edge.id);
				if (existingIndex !== -1) {
					this.conceptualEdges[existingIndex] = edge;
				} else if (action === 'create') {
					this.conceptualEdges.push(edge);
				}
			} else if (action === 'delete') {
				this.conceptualEdges = this.conceptualEdges.filter(e => e.id !== edge.id);
			}
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
			if (this.conceptualNodes.size < 5) {
				return "It looks like your canvas is getting started! To avoid confusion, I recommend trying the **Radial Mode**: place your central Focus Node in the middle and radiate outwards with new resources.";
			} else if (this.resources.length > 10 && this.currentNodeSummary.group < 5) {
				return "You've gathered a lot of resources. I suggest switching to the **Categorical Grouping Mode** (use the Group Node tool) to organize the different perspectives on this topic.";
			} else {
				return `That's an interesting point about "${userMessage}". Based on your current structure, have you considered the **Causal Link** between Concept A and Resource B?`;
			}
		}
	},
});


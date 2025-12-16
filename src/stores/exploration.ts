import { defineStore } from 'pinia';
import {
    ResourceItem,
    ConceptualNode,
    ConceptualEdge,
    ManualResourceData,
    CanvasView,
    AIChatMessage,
    NodeSummary
} from '@/interfaces/exploration'; // Assuming interfaces are defined here
import { v4 as uuidv4 } from 'uuid';

// Utility for fetching data (e.g., from a simulated API)
const api = {
    fetchData: (endpoint: string) => { /* simulated API call */ },
    search: (term: string) => { /* simulated search API call */ },
    // ... other methods
};

interface ExplorationState {
    // --- 1. Resource Management ---
    resources: ResourceItem[];

    // --- 2. Conceptual Map Management (Supports Multi-Canvas) ---
    canvasViews: CanvasView[]; // List of all defined canvas views (U.S. 2)
    activeCanvasViewId: string; // The currently visible canvas view
    conceptualNodes: ConceptualNode[]; // Nodes for the active view
    conceptualEdges: ConceptualEdge[]; // Edges for the active view

    // --- 3. AI Interaction & State ---
    chatMessages: AIChatMessage[];
    isTyping: boolean;
    aiSearchSuggestions: string[];
    hasUnreadAIChat: boolean; // For Notification Badge (U.S. 10)

    // --- 4. Reflection & Progress ---
    reflectionLogs: any[]; // Placeholder for reflection entries
    isExplorationSufficient: boolean; // Ready to transition (U.S. footer)
}

export const useExplorationStore = defineStore('exploration', {
    state: (): ExplorationState => ({
        resources: [],
        canvasViews: [{ id: 'default-view', name: 'Primary Exploration', createdAt: new Date() }],
        activeCanvasViewId: 'default-view',
        conceptualNodes: [],
        conceptualEdges: [],

        chatMessages: [],
        isTyping: false,
        aiSearchSuggestions: ['Ethical implications of AGI', 'Historical context of AI research'],
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
            const summary: NodeSummary = { Insight: 0, Query: 0, Resource: 0, Group: 0 };
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
            return state.resources.length > 5 && state.conceptualNodes.length > 10;
        },
    },

    actions: {
        // --- Initialization & Loading ---
        async loadExplorationData() {
            // Simulate loading data for the current active view and resources
            // This would typically involve API calls to fetch: resources, nodes, edges, chat history
            try {
                // Example:
                // this.resources = await api.fetchData('/exploration/resources');
                // this.conceptualNodes = await api.fetchData(`/exploration/canvas/${this.activeCanvasViewId}/nodes`);
            } catch (error) {
                console.error('Failed to load exploration data:', error);
            }
        },

        // --- Resource Management (U.S. 4, 5) ---
        async searchResources(term: string) {
            this.isTyping = true;
            try {
                // Simulate aggregated search (internal + external)
                const results = await api.search(term);

                // Example: Only add to repository if they are not already present
                // this.resources.push(...results);
            } catch (error) {
                console.error("Resource search failed:", error);
            } finally {
                this.isTyping = false;
            }
        },

        addManualResource(data: ManualResourceData) {
            // Logic to process ManualResourceData and convert it into a full ResourceItem
            const newResource: ResourceItem = {
                id: uuidv4(),
                title: data.title || (data.url ? `Manual Link: ${data.url}` : 'Manual Note'),
                url: data.url as string,
                summary: '',
                source_type: 'WEB',
                collected_at: '',
                keywords: [],
                user_notes: '',
                raw_content: data.content || '',
                relevance_score: 1.0, // Manual resources are considered highly relevant
            };
            this.resources.push(newResource);
        },

        // --- Conceptual Map Management (U.S. 6, 7, 8) ---

        /** Adds a ResourceItem to the active canvas as a Resource Node */
        addResourceToCanvas(item: ResourceItem, position: { x: number, y: number }) {
            const newNode: ConceptualNode = {
                id: uuidv4(),
                type: 'CONCEPT',
                label: item.title,
                resource_id: item.id, // Link back to the full resource data
                user_notes: '',
                x: position.x,
                y: position.y,
                // ... other Resource Node properties
            };
            this.conceptualNodes.push(newNode);
        },

        /** Handles updates for existing nodes, including moving, grouping, and editing */
        updateConceptualMapNode(node: ConceptualNode, action: 'move' | 'link' | 'edit' | 'delete' | 'group') {
            const index = this.conceptualNodes.findIndex(n => n.id === node.id);
            if (index !== -1) {
                if (action === 'delete') {
                    this.conceptualNodes.splice(index, 1);
                    // Also delete related edges
                    this.conceptualEdges = this.conceptualEdges.filter(e => e.source !== node.id && e.target !== node.id);
                } else {
                    this.conceptualNodes[index] = node;
                }
            } else if (action === 'group') {
                // Logic to create or update a Group Node (U.S. 7)
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
            if (this.activeCanvasViewId === viewId) return;

            // 1. Save current view's nodes/edges (critical step)
            // SaveNodesAndEdges(this.activeCanvasViewId, this.conceptualNodes, this.conceptualEdges);

            this.activeCanvasViewId = viewId;
            // 2. Load new view's data
            // this.conceptualNodes = await api.fetchData(`/exploration/canvas/${viewId}/nodes`);
            // this.conceptualEdges = await api.fetchData(`/exploration/canvas/${viewId}/edges`);

            // For now, simulating load:
            this.conceptualNodes = [];
            this.conceptualEdges = [];
        },

        // --- AI Interaction (U.S. 10, 11) ---

        addMessage(content: string, isUser: boolean = true) {
            this.chatMessages.push({
                id: uuidv4(),
                role: 'system',
                content: content,
                name: 'User',
                isUser: isUser,
                timestamp: new Date().toISOString(),
                sequence_number: 0
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
            if (this.conceptualNodes.length < 5) {
                return "It looks like your canvas is getting started! To avoid confusion, I recommend trying the **Radial Mode**: place your central Focus Node in the middle and radiate outwards with new resources.";
            } else if (this.resources.length > 10 && this.currentNodeSummary.Group < 5) {
                return "You've gathered a lot of resources. I suggest switching to the **Categorical Grouping Mode** (use the Group Node tool) to organize the different perspectives on this topic.";
            } else {
                return `That's an interesting point about "${userMessage}". Based on your current structure, have you considered the **Causal Link** between Concept A and Resource B?`;
            }
        }
    },
});


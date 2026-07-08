import { useWebSocket } from '@/composables/useWebSocket';
import config from '@/config';
import { ConceptualEdge, ConceptualGraph } from '@/interfaces/conceptual-map';
import type {
    ChatMessage
} from '@/interfaces/core';
import type { WebSocketMessage } from '@/interfaces/notification';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useConsultationStore } from './consultation';

// Define your WebSocket URL
const AURAFLUX_WS_URL = config.AURAFLUX_WS_URL;

export const useNotificationStore = defineStore('notification', () => {
    const consultationStore = useConsultationStore();

    // Extract the reactive properties from the composable
    const {
        isConnected,
        status,
        receivedMessage,
        error
    } = useWebSocket(AURAFLUX_WS_URL);

    const latestCanvasUpdate = ref<{
        canvasId: string;
        type: 'NODE_MOVED' | 'EDGE_ADD' | 'GRAPH_SYNC';
        data: any;
        timestamp: number;
    } | null>(null);

    // --- Local State ---
    const notifications = ref<{[key: string]: any;}>({});

    async function _handleConceptualEdgesRecommendation(payload: ConceptualGraph) {
        latestCanvasUpdate.value = {
            canvasId: payload.canvasId,
            type: 'EDGE_ADD',
            data: payload,
            timestamp: Date.now()
        };
    }

    async function _handleConceptualNodesRecommendation(payload: ConceptualGraph) {
        latestCanvasUpdate.value = {
            canvasId: payload.canvasId,
            type: 'GRAPH_SYNC',
            data: payload,
            timestamp: Date.now()
        };
    }

    async function _handleConsultationEAStream(payload: any) {
        let responseText = payload['full_response_text']
        let status = payload['status']

        let lastMessage = consultationStore.chatMessages.at(-1) as ChatMessage;
        lastMessage.content = responseText
        if (status === 'COMPLETE') {
            consultationStore.isTyping = false
        }
    }

    // --- Actions ---

    /**
     * Watches for new messages and processes them into the history.
     * This is the main action triggered by the connection.
     */
    async function processNewNotification(message: WebSocketMessage | null) {
        if (!message) {
            console.warn('Received invalid message:', message);
            return;
        }

        let payload = JSON.parse(JSON.stringify(message.payload));
        switch (message.event_type) {
            case 'consultation_ea_stream':
                _handleConsultationEAStream(payload);
                break;
            case 'conceptual_edges_recommendation':
                _handleConceptualEdgesRecommendation(payload);
                break;
            case 'conceptual_nodes_recommendation':
                _handleConceptualNodesRecommendation(payload);
                break;
            default:
                break;
        }
    }

    // --- Setup and Watcher ---

    // Watch the reactive message from the composable and run the processing logic
    watch(receivedMessage, processNewNotification, { deep: true });

    return {
        // State
        isConnected,
        error,
        notifications,
        latestCanvasUpdate,

        // Actions (if you had any, e.g., mark_as_read)
        // markAsRead: (id: number) => { ... }
    };
});
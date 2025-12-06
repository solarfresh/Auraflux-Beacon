import { useWebSocket } from '@/composables/useWebSocket';
import config from '@/config';
import type {
    ChatMessage
} from '@/interfaces/initiation';
import type { WebSocketMessage } from '@/interfaces/notification';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useInitiativeStore } from './initiation';

// Define your WebSocket URL
const AURAFLUX_WS_URL = config.AURAFLUX_WS_URL;

export const useNotificationStore = defineStore('notification', () => {

    // --- State from Composable ---
    const initiativeStore = useInitiativeStore();
    // Extract the reactive properties from the composable
    const {
        isConnected,
        receivedMessage,
        error
    } = useWebSocket(AURAFLUX_WS_URL);

    // --- Local State ---
    const notifications = ref<{[key: string]: any;}>({});

    async function _handleInitiationEAStream(payload: any) {
        let responseText = payload['full_response_text']
        let status = payload['status']

        let lastMessage = initiativeStore.chatMessages.at(-1) as ChatMessage;
        lastMessage.content = responseText
        if (status === 'COMPLETE') {
            initiativeStore.isTyping = false
        }
    }

    async function _handleInitiationRefinedTopic(payload: any) {
        initiativeStore.feasibilityStatus = payload['feasibility_status'];
        initiativeStore.finalQuestion = payload['final_research_question'];
        initiativeStore.resourceSuggestion = payload['resource_suggestion'];
        initiativeStore.stabilityScore = payload['stability_score'];
        initiativeStore.topicKeywords = payload['keywords'];
        initiativeStore.topicScope = payload['scope'];
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

        switch (message.event_type) {
            case 'initiation_ea_stream':
                _handleInitiationEAStream(message.payload)
                break;
            case 'initiation_refined_topic':
                _handleInitiationRefinedTopic(message.payload)
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

        // Actions (if you had any, e.g., mark_as_read)
        // markAsRead: (id: number) => { ... }
    };
});
import { useWebSocket } from '@/composables/useWebSocket';
import config from '@/config';
import type { WebSocketMessage } from '@/interfaces/notification';
import type { Dichotomy } from '@/interfaces/search';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// Define your WebSocket URL
const AURAFLUX_WS_URL = config.AURAFLUX_WS_URL;

export const useNotificationStore = defineStore('notification', () => {

    // --- State from Composable ---
    // Extract the reactive properties from the composable
    const {
        isConnected,
        receivedMessage,
        error
    } = useWebSocket(AURAFLUX_WS_URL);

    // --- Local State ---
    const notifications = ref<{[key: string]: any;}>({});
    const dynamicDichotomies = ref<Dichotomy[]>([]);

    // --- Actions ---

    /**
     * Watches for new messages and processes them into the history.
     * This is the main action triggered by the connection.
     */
    function processNewNotification(message: WebSocketMessage | null) {
        if (message) {
            // Add the new payload to the history
            notifications.value[message.event_type] = message.payload;

            if (message.event_type === 'dichotomy_suggestions_complete') {
                dynamicDichotomies.value = message.payload.suggestions;
            }
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
        dynamicDichotomies,

        // Actions (if you had any, e.g., mark_as_read)
        // markAsRead: (id: number) => { ... }
    };
});
import config from '@/config';
import { useWebSocket } from '@/composables/useWebSocket';
import type { NotificationPayload, WebSocketMessage } from '@/interfaces/notification';
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
    const notifications = ref<{[key: string]: NotificationPayload;}>({});

    // --- Actions ---

    /**
     * Watches for new messages and processes them into the history.
     * This is the main action triggered by the connection.
     */
    function processNewNotification(message: WebSocketMessage | null) {
        if (message && message.type === 'send_notification') {
            // Add the new payload to the history
            notifications.value[message.event_type] = message.data;

            // Optionally, trigger a temporary visual alert (e.g., toast) here
            console.log('Processed new notification for history:', message.data.title);
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
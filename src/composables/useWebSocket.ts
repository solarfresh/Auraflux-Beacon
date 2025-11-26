import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { WebSocketMessage } from '@/interfaces/notification';

/**
 * Establishes and manages a WebSocket connection for receiving notifications.
 * @param url The WebSocket URL to connect to.
 * @returns An object containing reactive connection status and received message.
 */
export function useWebSocket(url: string) {
    // Reactive state
    const socket: Ref<WebSocket | null> = ref(null);
    const isConnected: Ref<boolean> = ref(false);
    // Use the defined interface for the received message
    const receivedMessage: Ref<WebSocketMessage | null> = ref(null);
    const error: Ref<Event | null> = ref(null);

    // --- Core Logic ---

    const connect = () => {
        // Clear any previous error
        error.value = null;

        // 1. Establish the connection
        socket.value = new WebSocket(url);

        // 2. Event Listeners

        socket.value.onopen = () => {
            isConnected.value = true;
            console.log('✅ WebSocket connection established.');
        };

        socket.value.onmessage = (event) => {
            try {
                // Assert the parsed data to be of the expected type
                const message = JSON.parse(event.data) as WebSocketMessage;

                // Check the internal 'type' property set by the Channel Layer
                if (message.type === 'send_notification') {
                    receivedMessage.value = message;
                    console.log('🔔 Notification received:', message.event_type, message.data);
                }
            } catch (e) {
                console.error('Error parsing or handling WebSocket message:', e);
                error.value = event;
            }
        };

        socket.value.onerror = (e) => {
            error.value = e;
            console.error('❌ WebSocket Error:', e);
        };

        socket.value.onclose = (event) => {
            isConnected.value = false;
            console.warn(`🛑 WebSocket closed. Code: ${event.code}`);
        };
    };

    const close = () => {
        if (socket.value && isConnected.value) {
            socket.value.close(1000, 'Composable cleanup');
        }
    };

    // --- Lifecycle Hooks ---

    // Initiate connection when the component using this composable mounts
    onMounted(connect);

    // Clean up connection when the component unmounts
    onUnmounted(close);

    return {
        isConnected,
        receivedMessage,
        error,
        close,
    };
}
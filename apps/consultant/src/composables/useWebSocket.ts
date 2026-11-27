import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { WebSocketMessage } from '@/interfaces/notification';
import { WebSocketService } from '@auraflux/shared-core/services/webSocketService';

/**
 * Establishes and manages a WebSocket connection for receiving notifications.
 * @param url The WebSocket URL to connect to.
 * @returns An object containing reactive connection status and received message.
 */
export function useWebSocket(url: string) {
	// Reactive state
	const isConnected: Ref<boolean> = ref(false);
	const receivedMessage: Ref<WebSocketMessage | null> = ref(null);
	const error: Ref<Event | null> = ref(null);
	const status: Ref<'connected' | 'disconnected' | 'reconnecting' | 'failed'> = ref('disconnected');

	let service: WebSocketService | null = null;

	const connect = () => {
		if (service) {
			service.close();
		}

		service = new WebSocketService(url, {
			onMessage: (msg) => {
				receivedMessage.value = msg;
			},
			onError: (err) => {
				error.value = err;
			},
			onStatusChange: (newStatus) => {
				status.value = newStatus;
				isConnected.value = (newStatus === 'connected');
			}
		});

		service.connect();
	};

	const close = () => {
		if (service) {
			service.close();
		}
	};

	// --- Lifecycle Hooks ---

	// Initiate connection when the component using this composable mounts
	onMounted(connect);

	// Clean up connection when the component unmounts
	onUnmounted(close);

	return {
			isConnected,
			status,
			receivedMessage,
			error,
			close,
			connect
	};
}

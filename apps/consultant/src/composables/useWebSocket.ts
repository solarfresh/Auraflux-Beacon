import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { WebSocketMessage } from '@/interfaces/notification';
import config from '@/config';

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
	const status: Ref<'connected' | 'disconnected' | 'reconnecting' | 'failed'> = ref('disconnected');

	// Internal state for reconnection logic
	let reconnectAttempts = 0;
	let reconnectTimer: number | null = null;
	let isExplicitClose = false;

	// --- Core Logic ---

	/**
	 * Calculates the next delay using exponential backoff with a cap.
	 * @param attempt The current attempt number (starting at 0).
	 * @returns The delay time in milliseconds.
	 */
	const calculateBackoff = (attempt: number): number => {
		const delay = config.WS_INITIAL_BACKOFF_TIME_MS * Math.pow(2, attempt);
		// Add jitter (e.g., up to 10% of the delay) to prevent thundering herd
		const jitter = Math.random() * 0.1 * delay;
		return Math.min(delay + jitter, config.WS_MAX_BACKOFF_TIME_MS);
	};

	/**
	 * Attempts to establish a new connection using the exponential backoff strategy.
	 */
	const attemptReconnect = () => {
		if (isExplicitClose || reconnectAttempts >= config.WS_MAX_RECONNECT_ATTEMPTS) {
			status.value = 'failed';
			console.error(`❌ WebSocket connection failed permanently after ${config.WS_MAX_RECONNECT_ATTEMPTS} attempts.`);
			return;
		}

		const delay = calculateBackoff(reconnectAttempts);
		reconnectAttempts++;
		status.value = 'reconnecting';
		console.warn(`⏳ Attempting to reconnect in ${Math.round(delay / 1000)}s (Attempt ${reconnectAttempts}/${config.WS_MAX_RECONNECT_ATTEMPTS})...`);

		reconnectTimer = window.setTimeout(() => {
			connect();
		}, delay);
	};

	/**
	 * Establishes the WebSocket connection and sets up event listeners.
	 */
	const connect = () => {
		// Clear any previous error
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
		isExplicitClose = false;
		error.value = null;

		// 1. Establish the connection
		socket.value = new WebSocket(url);

		// 2. Event Listeners

		socket.value.onopen = () => {
			isConnected.value = true;
			status.value = 'connected';
			reconnectAttempts = 0; // SUCCESS: Reset attempts counter
			console.log('✅ WebSocket connection established.');
		};

		socket.value.onmessage = (event) => {
			try {
				// Assert the parsed data to be of the expected type
				const message = JSON.parse(event.data) as WebSocketMessage;
				receivedMessage.value = message;
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
			status.value = 'disconnected';
			console.warn(`🛑 WebSocket closed. Code: ${event.code}. Clean: ${event.wasClean}.`);

			if (!isExplicitClose && (event.code !== 1000 || !event.wasClean)) {
				attemptReconnect();
			}
		};
	};

	const close = () => {
		isExplicitClose = true;
		if (reconnectTimer) {
				clearTimeout(reconnectTimer);
				reconnectTimer = null;
		}
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
			status,
			receivedMessage,
			error,
			close,
			connect
	};
}
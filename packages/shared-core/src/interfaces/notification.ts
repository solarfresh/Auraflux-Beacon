export interface WebSocketMessage {
    // Matches the 'type': 'send_notification' key in the Python code
    type: 'send_notification';
    // Matches the 'event_type' parameter
    event_type: string;
    // Matches the 'data' key which holds the payload
    payload: any;
}

export interface WebSocketServiceOptions {
	initialBackoffTimeMs?: number;
	maxBackoffTimeMs?: number;
	maxReconnectAttempts?: number;
	onMessage?: (message: WebSocketMessage) => void;
	onError?: (error: Event) => void;
	onStatusChange?: (status: 'connected' | 'disconnected' | 'reconnecting' | 'failed') => void;
}

export type MessageType = 'send_notification' | 'broadcast_event';

export interface WebSocketMessage {
    // Matches the 'type': 'send_notification' key in the Python code
    type: MessageType;
    // Matches the 'event_type' parameter
    event_type: string;
    // Matches the 'data' key which holds the payload
    payload: any;
}

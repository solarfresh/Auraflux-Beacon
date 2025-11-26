export interface NotificationPayload {
    // This could be any shape based on your application needs
    id: number;
    title: string;
    message: string;
    timestamp: string;
}

export interface WebSocketMessage {
    // Matches the 'type': 'send_notification' key in the Python code
    type: 'send_notification';
    // Matches the 'event_type' parameter
    event_type: string;
    // Matches the 'data' key which holds the payload
    data: NotificationPayload;
}

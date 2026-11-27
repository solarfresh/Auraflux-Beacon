import type { WebSocketMessage, WebSocketServiceOptions } from '@auraflux/shared-core/interfaces/notification';
import { WebSocketService } from '@auraflux/shared-core/services/webSocketService';

type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketManager {
  private service: WebSocketService | null = null;
  private handlers = new Map<string, Set<MessageHandler>>();

  public init(url: string, options?: WebSocketServiceOptions) {
    if (this.service) return;

    this.service = new WebSocketService(url, {
      ...options,
      onMessage: (message) => this.handleMessage(message),
      onStatusChange: (status) => console.log(`WebSocket Status: ${status}`),
      onError: (error) => console.error('WebSocket Error:', error),
    });
    this.service.connect();
  }

  public subscribe(eventType: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => this.unsubscribe(eventType, handler);
  }

  public unsubscribe(eventType: string, handler: MessageHandler) {
    this.handlers.get(eventType)?.delete(handler);
  }

  public disconnect() {
    this.service?.close();
    this.service = null;
    this.handlers.clear();
  }

  private handleMessage(message: WebSocketMessage) {
    const eventType = message.event_type;
    const eventHandlers = this.handlers.get(eventType);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        try {
          handler(message);
        } catch (e) {
          console.error(`Error in handler for event ${eventType}:`, e);
        }
      });
    }
  }
}

export const webSocketManager = new WebSocketManager();

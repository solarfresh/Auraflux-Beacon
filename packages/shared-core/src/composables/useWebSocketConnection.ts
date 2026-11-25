import type { WebSocketMessage, WebSocketServiceOptions } from '@auraflux/shared-core/interfaces/notification';
import { webSocketManager } from '@auraflux/shared-core/services/webSocketManager';
import { onMounted, onUnmounted } from 'vue';

type MessageHandler = (message: WebSocketMessage) => void;

export function useWebSocketConnection(url?: string, options?: WebSocketServiceOptions) {
  const wsUrl = url || 'ws://localhost:8080';

  onMounted(() => {
    webSocketManager.init(wsUrl, options);
  });

  onUnmounted(() => {
    webSocketManager.disconnect();
  });

  const subscribe = (eventType: string, handler: MessageHandler) => {
    return webSocketManager.subscribe(eventType, handler);
  };

  const unsubscribe = (eventType: string, handler: MessageHandler) => {
    webSocketManager.unsubscribe(eventType, handler);
  };

  return {
    subscribe,
    unsubscribe,
  };
}

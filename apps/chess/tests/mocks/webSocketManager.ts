import { vi } from 'vitest';

export const mockWebSocketManager = {
  init: vi.fn(),
  subscribe: vi.fn(() => vi.fn()),
  unsubscribe: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('@auraflux/shared-core/services/webSocketManager', () => ({
  webSocketManager: mockWebSocketManager
}));

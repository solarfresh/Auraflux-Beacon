import { vi } from 'vitest';

export const mockApiService = {
  canvases: {
    getGraph: vi.fn(),
    createNode: vi.fn(),
    updateNode: vi.fn(),
    deleteNode: vi.fn(),
    createEdge: vi.fn(),
    updateEdge: vi.fn(),
    deleteEdge: vi.fn(),
    batchUpdateNodePositions: vi.fn(),
    triggerNodeOperator: vi.fn()
  }
};

vi.mock('@/api/apiService', () => ({
  apiService: mockApiService
}));

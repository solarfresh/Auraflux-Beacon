import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CanvasService } from '@/services/canvasService';
import { apiService } from '@/api/apiService';

vi.mock('@/api/apiService', () => ({
  apiService: {
    canvases: {
      createNode: vi.fn()
    }
  }
}));

describe('CanvasService', () => {
  let canvasService: CanvasService;

  beforeEach(() => {
    vi.clearAllMocks();
    canvasService = new CanvasService('test-canvas');
  });

  describe('createNode', () => {
    it('should successfully create a node and return mapped ConceptualNode', async () => {
      const mockResponse = {
        data: {
          id: 'node-1',
          label: 'Test Node',
          type: 'CONCEPT',
          position: { x: 10, y: 20 },
          status: 'DRAFT'
        }
      };

      vi.mocked(apiService.canvases.createNode).mockResolvedValueOnce(mockResponse as any);

      const result = await canvasService.createNode({ label: 'Test Node' });

      expect(apiService.canvases.createNode).toHaveBeenCalledWith('test-canvas', {
        label: 'Test Node',
        type: 'CONCEPT',
        position: { x: 100, y: 100 }
      });
      expect(result).toEqual({
        id: 'node-1',
        label: 'Test Node',
        type: 'CONCEPT',
        content: undefined,
        sourceRef: undefined,
        rationale: undefined,
        position: { x: 10, y: 20 },
        status: 'DRAFT',
        handles: undefined
      });
    });

    it('should return null when response data is missing', async () => {
      vi.mocked(apiService.canvases.createNode).mockResolvedValueOnce({ data: null } as any);

      const result = await canvasService.createNode({ label: 'Test' });
      expect(result).toBeNull();
    });

    it('should throw error when apiService fails', async () => {
      vi.mocked(apiService.canvases.createNode).mockRejectedValueOnce(new Error('API Error'));

      await expect(canvasService.createNode({ label: 'Test' })).rejects.toThrow('API Error');
    });
  });

  describe('addNode', () => {
    it('should add temporary node, call api, remove temp node and add created node', async () => {
      const addNodeToContext = vi.fn();
      const removeNodeFromContext = vi.fn();

      const mockResponse = {
        data: {
          id: 'real-node-1',
          label: 'New Node',
          type: 'CONCEPT',
          position: { x: 100, y: 100 },
          status: 'DRAFT'
        }
      };

      vi.mocked(apiService.canvases.createNode).mockResolvedValueOnce(mockResponse as any);

      await canvasService.addNode('custom-canvas', addNodeToContext, removeNodeFromContext);

      expect(addNodeToContext).toHaveBeenCalledTimes(2);
      expect(removeNodeFromContext).toHaveBeenCalledTimes(1);
      expect(removeNodeFromContext).toHaveBeenCalledWith(expect.stringContaining('temp-'));
    });

    it('should handle creation error by removing temporary node', async () => {
      const addNodeToContext = vi.fn();
      const removeNodeFromContext = vi.fn();

      vi.mocked(apiService.canvases.createNode).mockRejectedValueOnce(new Error('Fail'));

      await canvasService.addNode(undefined, addNodeToContext, removeNodeFromContext);

      expect(addNodeToContext).toHaveBeenCalledTimes(1);
      expect(removeNodeFromContext).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateNode, deleteNode, createEdge placeholders', () => {
    it('should return true for updateNode', async () => {
      const res = await canvasService.updateNode('1', { label: 'updated' });
      expect(res).toBe(true);
    });

    it('should return true for deleteNode', async () => {
      const res = await canvasService.deleteNode('1');
      expect(res).toBe(true);
    });

    it('should return edgeData for createEdge', async () => {
      const edge = { id: 'edge-1', source: '1', target: '2' };
      const res = await canvasService.createEdge(edge);
      expect(res).toEqual(edge);
    });
  });
});

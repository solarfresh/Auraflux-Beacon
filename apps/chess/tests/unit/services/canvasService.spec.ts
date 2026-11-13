import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CanvasService } from '@/services/canvasService';
import { apiService } from '@/api/apiService';

vi.mock('@/api/apiService', () => ({
  apiService: {
    canvases: {
      createNode: vi.fn(),
      createEdge: vi.fn()
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

  describe('updateNode, deleteNode', () => {
    it('should successfully duplicate a node', async () => {
      const addNodeToContext = vi.fn();
      const removeNodeFromContext = vi.fn();
      const node = {
        id: 'node-1',
        label: 'Original',
        type: 'CONCEPT',
        position: { x: 10, y: 10 },
        status: 'ACTIVE'
      } as any;

      const mockResponse = {
        data: {
          id: 'node-2',
          label: 'Original (Copy)',
          type: 'CONCEPT',
          position: { x: 60, y: 60 },
          status: 'DRAFT'
        }
      };

      vi.mocked(apiService.canvases.createNode).mockResolvedValueOnce(mockResponse as any);

      await canvasService.duplicateNode(node, 'custom-canvas', addNodeToContext, removeNodeFromContext);

      expect(addNodeToContext).toHaveBeenCalledTimes(2);
      expect(removeNodeFromContext).toHaveBeenCalledTimes(1);
    });

    it('should return true for updateNode', async () => {
      const res = await canvasService.updateNode('1', { label: 'updated' });
      expect(res).toBe(true);
    });

    it('should return true for deleteNode', async () => {
      const res = await canvasService.deleteNode('1');
      expect(res).toBe(true);
    });
  });

  describe('createEdge', () => {
    it('should successfully create an edge when valid and not duplicate/self-loop', async () => {
      const mockResponse = {
        data: {
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          type: 'LINK',
          weight: 1
        }
      };

      vi.mocked(apiService.canvases.createEdge).mockResolvedValueOnce(mockResponse as any);

      const result = await canvasService.createEdge('node-1', 'node-2', []);

      expect(apiService.canvases.createEdge).toHaveBeenCalledWith('test-canvas', {
        source: 'node-1',
        target: 'node-2',
        type: 'LINK',
        weight: 1
      });
      expect(result).toEqual({
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'LINK',
        weight: 1,
        label: undefined,
        status: undefined,
        evidence: undefined,
        rationale: undefined,
        metadata: undefined,
        sourceHandle: undefined,
        targetHandle: undefined
      });
    });

    it('should throw error on self-loop connection', async () => {
      await expect(canvasService.createEdge('node-1', 'node-1', [])).rejects.toThrow(
        'Self-loop connection is not allowed'
      );
      expect(apiService.canvases.createEdge).not.toHaveBeenCalled();
    });

    it('should throw error on duplicate edge connection', async () => {
      const existingEdges = [{ id: 'edge-1', source: 'node-1', target: 'node-2' }] as any;

      await expect(canvasService.createEdge('node-1', 'node-2', existingEdges)).rejects.toThrow(
        'Duplicate edge is not allowed'
      );
      expect(apiService.canvases.createEdge).not.toHaveBeenCalled();
    });
  });
});

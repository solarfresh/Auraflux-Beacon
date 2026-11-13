import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CanvasService } from '@/services/canvasService';
import { apiService } from '@/api/apiService';
import { CanvasLoadError } from '@/errors/canvases';
import { ConceptualNode } from '@/interfaces/canvases';

vi.mock('@/api/apiService', () => ({
  apiService: {
    canvases: {
      getGraph: vi.fn(),
      createNode: vi.fn(),
      updateNode: vi.fn(),
      createEdge: vi.fn(),
      updateEdge: vi.fn()
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
        } as ConceptualNode
      };

      vi.mocked(apiService.canvases.createNode).mockResolvedValueOnce({
        data: mockResponse.data,
      } as any);

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
      const oldNode: ConceptualNode = { id: '1', label: 'old', type: 'CONCEPT', position: { x: 0, y: 0 }, status: 'ACTIVE', content: undefined, sourceRef: undefined, rationale: undefined, handles: undefined };

      const mockResponse = {
        data: {
          id: '1',
          label: 'updated',
          type: 'CONCEPT',
          position: { x: 0, y: 0 },
          status: 'ACTIVE'
        }
      };
      vi.mocked(apiService.canvases.updateNode).mockResolvedValueOnce(mockResponse as any);

      const res = await canvasService.updateNode('1', { label: 'updated' }, oldNode, vi.fn());
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
        weight: 1,
        sourceHandle: null,
        targetHandle: null
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

    it('should successfully create an edge with handles when valid', async () => {
      const mockResponse = {
        data: {
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          sourceHandle: 'handle-s1',
          targetHandle: 'handle-t1',
          type: 'LINK',
          weight: 1
        }
      };

      vi.mocked(apiService.canvases.createEdge).mockResolvedValueOnce(mockResponse as any);

      const result = await canvasService.createEdge('node-1', 'node-2', [], 'handle-s1', 'handle-t1');

      expect(apiService.canvases.createEdge).toHaveBeenCalledWith('test-canvas', {
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'handle-s1',
        targetHandle: 'handle-t1',
        type: 'LINK',
        weight: 1
      });
      expect(result).toEqual({
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'handle-s1',
        targetHandle: 'handle-t1',
        type: 'LINK',
        weight: 1,
        label: undefined,
        status: undefined,
        evidence: undefined,
        rationale: undefined,
        metadata: undefined
      });
    });

    it('should throw error on duplicate edge connection with same handles', async () => {
      const existingEdges = [{ id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'handle-s1', targetHandle: 'handle-t1' }] as any;

      await expect(canvasService.createEdge('node-1', 'node-2', existingEdges, 'handle-s1', 'handle-t1')).rejects.toThrow(
        'Duplicate edge is not allowed'
      );
      expect(apiService.canvases.createEdge).not.toHaveBeenCalled();
    });

    it('should allow multiple edges with different handles', async () => {
      const existingEdges = [{ id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'handle-s1', targetHandle: 'handle-t1' }] as any;
      const mockResponse = {
        data: {
          id: 'edge-2',
          source: 'node-1',
          target: 'node-2',
          sourceHandle: 'handle-s2',
          targetHandle: 'handle-t2',
          type: 'LINK',
          weight: 1
        }
      };

      vi.mocked(apiService.canvases.createEdge).mockResolvedValueOnce(mockResponse as any);

      await canvasService.createEdge('node-1', 'node-2', existingEdges, 'handle-s2', 'handle-t2');

      expect(apiService.canvases.createEdge).toHaveBeenCalledWith('test-canvas', expect.objectContaining({
        sourceHandle: 'handle-s2',
        targetHandle: 'handle-t2'
      }));
    });
  });

  describe('getCanvasGraph', () => {
    it('should successfully fetch and map canvas graph', async () => {
      const mockResponse = {
        data: {
          id: 'test-canvas',
          title: 'Test Canvas',
          nodes: [{ id: 'n1', label: 'Node 1', type: 'CONCEPT', position: { x: 0, y: 0 }, status: 'DRAFT' }],
          edges: [{ id: 'e1', source: 'n1', target: 'n2', type: 'LINK' }]
        }
      };

      vi.mocked(apiService.canvases.getGraph).mockResolvedValueOnce(mockResponse as any);

      const result = await canvasService.getCanvasGraph('test-canvas');

      expect(apiService.canvases.getGraph).toHaveBeenCalledWith('test-canvas');
      expect(result).toEqual({
        id: 'test-canvas',
        title: 'Test Canvas',
        conceptualNodes: new Map([['n1', { id: 'n1', label: 'Node 1', type: 'CONCEPT', position: { x: 0, y: 0 }, status: 'DRAFT', content: undefined, sourceRef: undefined, rationale: undefined, handles: undefined }]]),
        conceptualEdges: [{
          id: 'e1', source: 'n1', target: 'n2', type: 'LINK',
          weight: undefined, label: undefined, status: undefined, evidence: undefined, rationale: undefined,
          metadata: undefined, sourceHandle: undefined, targetHandle: undefined
        }],
        pendingConnection: null,
        localEdgeData: {
          id: '',
          source: '',
          target: '',
          type: 'LINK',
          weight: 1,
        },
        viewport: { x: 0, y: 0, zoom: 1 },
      });
    });

    it('should throw CanvasLoadError when API fails', async () => {
      vi.mocked(apiService.canvases.getGraph).mockRejectedValueOnce(new CanvasLoadError('Network error'));
      await expect(canvasService.getCanvasGraph('test-canvas')).rejects.toThrow(CanvasLoadError);
    });
  });
});

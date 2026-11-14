import { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { beforeEach, vi } from 'vitest';
import { reactive, ref } from 'vue';

export const canvasServiceMock = {
  addNode: vi.fn(async (instanceId, addNodeToContext) => {
    addNodeToContext({
      id: 'server-node-1',
      label: 'New Node',
      type: 'CONCEPT',
      position: { x: 100, y: 100 },
      status: 'DRAFT'
    });
  }),
  duplicateNode: vi.fn(async (node, instanceId, addNodeToContext) => {
    if (typeof addNodeToContext === 'function') {
      addNodeToContext({
        id: 'server-node-dup',
        label: `${node.label} (Copy)`,
        type: node.type,
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        status: 'DRAFT'
      });
    }
  }),
  updateNode: vi.fn().mockResolvedValue(true),
  deleteNode: vi.fn().mockResolvedValue(true),
  updateEdge: vi.fn(async (id, data, oldEdge, updateEdgeInContext) => {
    updateEdgeInContext(id, data);
    return true;
  }),
  createEdge: vi.fn(async (sourceId, targetId, edges, sourceHandle, targetHandle) => ({
    id: 'edge-new',
    source: sourceId,
    target: targetId,
    type: 'LINK',
    weight: 1,
    sourceHandle,
    targetHandle
  })),
  getCanvasGraph: vi.fn()
};

vi.mock('@/services/canvasService', () => ({
  canvasService: canvasServiceMock
}));

export const mockConceptualMapContext = {
  instance: reactive({
    id: 'canvas-1',
    conceptualNodes: new Map([
      ['1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode],
      ['2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode],
    ]),
    conceptualEdges: [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }],
  }),
  selectedNodeId: ref<string | null>(null),
  selectedEdgeId: ref<string | null>(null),
  addNode: vi.fn((node: Partial<ConceptualNode>) => {
    const id = node?.id || `node-${Date.now()}`;
    mockConceptualMapContext.instance.conceptualNodes.set(id, {
      id,
      label: node?.label || 'New Node',
      type: node?.type || 'CONCEPT',
      position: node?.position || { x: 0, y: 0 },
      status: node?.status || 'DRAFT'
    } as ConceptualNode);
  }),
  addEdge: vi.fn(),
  updateNode: vi.fn(),
  updateEdge: vi.fn((id: string, updatedEdge: any) => {
    const idx = mockConceptualMapContext.instance.conceptualEdges.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockConceptualMapContext.instance.conceptualEdges.splice(idx, 1, updatedEdge);
    }
  }),
  selectNode: vi.fn((id: string) => {
    mockConceptualMapContext.selectedNodeId.value = id;
    mockConceptualMapContext.selectedEdgeId.value = null;
  }),
  removeNode: vi.fn((id: string) => {
    mockConceptualMapContext.instance.conceptualNodes.delete(id);
    mockConceptualMapContext.instance.conceptualEdges = mockConceptualMapContext.instance.conceptualEdges.filter(
      (e: any) => e.source !== id && e.target !== id
    );
    if (mockConceptualMapContext.selectedNodeId.value === id) {
      mockConceptualMapContext.selectedNodeId.value = null;
    }
  }),
  removeEdge: vi.fn((id: string) => {
    mockConceptualMapContext.instance.conceptualEdges = mockConceptualMapContext.instance.conceptualEdges.filter(
      (e: any) => e.id !== id
    );
    if (mockConceptualMapContext.selectedEdgeId.value === id) {
      mockConceptualMapContext.selectedEdgeId.value = null;
    }
  }),
  selectEdge: vi.fn((id: string) => {
    mockConceptualMapContext.selectedEdgeId.value = id;
    mockConceptualMapContext.selectedNodeId.value = null;
  }),
  deselectAllNodes: vi.fn(() => { mockConceptualMapContext.selectedNodeId.value = null; }),
  deselectAllEdges: vi.fn(() => { mockConceptualMapContext.selectedEdgeId.value = null; }),
  deselectAll: vi.fn(() => {
    mockConceptualMapContext.selectedNodeId.value = null;
    mockConceptualMapContext.selectedEdgeId.value = null;
  }),
  isNodeSelected: vi.fn((id: string) => mockConceptualMapContext.selectedNodeId.value === id),
  isEdgeSelected: vi.fn((id: string) => mockConceptualMapContext.selectedEdgeId.value === id),
};

vi.mock('@auraflux/shared-core/composables/useConceptualMapContext', () => ({
  useConceptualMapContext: () => mockConceptualMapContext
}));

export const defaultStubs = {
  VueFlow: true,
  Background: true,
  Controls: true,
  MiniMap: true,
  VNodeInspectorPanel: true,
  VEdgeInspectorPanel: true,
};

export const resetMockConceptualMapContext = () => {
  mockConceptualMapContext.instance.conceptualNodes = new Map([
      ['1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode],
      ['2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode],
    ]);
  mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }];
  mockConceptualMapContext.selectedNodeId.value = null;
  mockConceptualMapContext.selectedEdgeId.value = null;
};

beforeEach(() => {
  vi.clearAllMocks();
  resetMockConceptualMapContext();
});

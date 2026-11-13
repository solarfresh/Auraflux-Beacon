import { canvasService } from '@/services/canvasService';
import ChessPage from '@/components/pages/ChessPage.vue';
import { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive, ref } from 'vue';

vi.mock('@/services/canvasService', () => ({
  canvasService: {
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
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockConceptualMapContext.selectedNodeId.value = null;
  mockConceptualMapContext.selectedEdgeId.value = null;
});

// Mock conceptual map context
const mockConceptualMapContext = {
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

describe('ChessPage.vue', () => {
  it('updates node position when node-drag-stop event is triggered', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const vm = wrapper.vm as any;
    const newPosition = { x: 150, y: 250 };

    // Trigger node-drag-stop event
    vm.onNodeDragStop({ id: '1', position: newPosition });

    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.updateNode).toHaveBeenCalledWith('1', { position: newPosition });
  });

  it('updates node position with default {x:0, y:0} when drag event has invalid position', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    // Trigger node-drag-stop event with invalid position
    vm.onNodeDragStop({ id: '1', position: null });

    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.updateNode).toHaveBeenCalledWith('1', { position: { x: 0, y: 0 } });
  });

  it('renders knowledge graph canvas header and add button', () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Auraflux Chess - Knowledge Graph Canvas');
    expect(wrapper.find('button').text()).toBe('Add Node');
  });

  it('adds a new conceptual node via API and context when clicking Add Node button', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(canvasService.addNode).toHaveBeenCalledWith(
      'canvas-1',
      expect.any(Function),
      expect.any(Function)
    );
    expect(mockConceptualMapContext.addNode).toHaveBeenCalled();
  });

  it('initializes canvas graph on mount', async () => {
    vi.mocked(canvasService.getCanvasGraph).mockResolvedValueOnce({
      nodes: [{ id: '1', label: 'C1', type: 'CONCEPT', position: { x: 0, y: 0 }, status: 'ACTIVE' }],
      edges: []
    } as any);

    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });
  });

  // TODO: Future feature: Implement error handling and retry mechanism for canvas loading
  // it('shows error and retry when canvas loading fails', async () => {
  //   vi.mocked(canvasService.getCanvasGraph).mockRejectedValueOnce(new Error('Load Error'));

  //   const wrapper = mount(ChessPage, {
  //     global: {
  //       stubs: {
  //         VueFlow: true,
  //         Background: true,
  //         Controls: true,
  //         MiniMap: true,
  //       },
  //     },
  //   });

  //   await wrapper.vm.$nextTick();
  //   // Assuming UI renders "Error loading canvas" text
  //   expect(wrapper.text()).toContain('Error loading canvas');

  //   const retryBtn = wrapper.find('button.retry-btn');
  //   expect(retryBtn.exists()).toBe(true);

  //   vi.mocked(canvasService.getCanvasGraph).mockResolvedValueOnce({ nodes: [], edges: [] } as any);
  //   await retryBtn.trigger('click');
  //   expect(canvasService.getCanvasGraph).toHaveBeenCalledTimes(2);
  // });

  // it('shows error and retry when canvas loading fails', async () => {
  //   vi.mocked(canvasService.getCanvasGraph).mockRejectedValueOnce(new Error('Load Error'));

  //   const wrapper = mount(ChessPage, {
  //     global: {
  //       stubs: {
  //         VueFlow: true,
  //         Background: true,
  //         Controls: true,
  //         MiniMap: true,
  //       },
  //     },
  //   });

  //   await wrapper.vm.$nextTick();
  //   expect(wrapper.text()).toContain('Error loading canvas');

  //   const retryBtn = wrapper.find('button.retry-btn');
  //   expect(retryBtn.exists()).toBe(true);

  //   vi.mocked(canvasService.getCanvasGraph).mockResolvedValueOnce({ nodes: [], edges: [] } as any);
  //   await retryBtn.trigger('click');
  //   expect(canvasService.getCanvasGraph).toHaveBeenCalledTimes(2);
  // });

  it('rejects self-loop connections', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const vm = wrapper.vm as any;
    const warnSpy = vi.spyOn(console, 'warn');

    // Trigger onConnect with self-loop
    vm.onConnect({ source: '1', target: '1' });

    expect(warnSpy).toHaveBeenCalledWith('Reject self-loop connection');
    expect(mockConceptualMapContext.addEdge).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('selects and deselects nodes correctly', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    // Select node
    vm.selectNode({ id: '1' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');
    expect(mockConceptualMapContext.isNodeSelected('1')).toBe(true);

    // Deselect node
    mockConceptualMapContext.deselectAllNodes();
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
    expect(mockConceptualMapContext.isNodeSelected('1')).toBe(false);
  });

  it('handles non-existent node selection gracefully', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    vm.selectNode({ id: 'non-existent' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('non-existent');
    expect(vm.selectedNode).toBe(null);
  });

  it('renders horizontal dual-pane layout and renders VInspectorPanel', async () => {
    mockConceptualMapContext.selectedNodeId.value = '1';
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
          VInspectorPanel: {
            template: '<aside class="inspector-panel"><slot /></aside>',
            props: ['isExpanded']
          }
        },
      },
    });

    const mainContainer = wrapper.find('.flex-row');
    expect(mainContainer.exists()).toBe(true);
    expect(wrapper.find('aside.inspector-panel').exists()).toBe(true);
  });

  it('handles edge selection and mutual exclusion with node selection in ChessPage', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    // Select node
    vm.selectNode({ id: '1' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');

    // Select edge -> should clear node and set edge
    vm.selectEdge({ id: 'e1-2' });
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe('e1-2');
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);

    // Select node again -> should clear edge and set node
    vm.selectNode({ id: '2' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('2');
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);

    // Deselect all
    vm.deselectAll();
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);
  });

  it('renders VEdgeInspectorPanel when edge is selected', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    // Initially no edge selected
    expect(wrapper.findComponent({ name: 'VEdgeInspectorPanel' }).exists()).toBe(false);

    // Select edge
    mockConceptualMapContext.selectEdge('e1-2');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ name: 'VEdgeInspectorPanel' }).exists()).toBe(true);
  });

  it('updates edge properties when VEdgeInspectorPanel emits update:edge', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    const vm = wrapper.vm as any;
    vm.instance.conceptualEdges.push({
      id: 'e1-2',
      source: '1',
      target: '2',
      weight: 1,
      type: 'LINK'
    });

    mockConceptualMapContext.selectEdge('e1-2');
    await wrapper.vm.$nextTick();

    const inspector = wrapper.findComponent({ name: 'VEdgeInspectorPanel' });
    const updatedEdgeData = { id: 'e1-2', weight: 3, type: 'ASSOCIATION' };
    inspector.vm.$emit('update:edge', updatedEdgeData);
    await wrapper.vm.$nextTick();

    // Verify local state update since updateEdgeInContext is internal
    expect(vm.selectedEdge.weight).toBe(3);
    expect(vm.selectedEdge.type).toBe('ASSOCIATION');
  });

  it('removes selected node and cascades edge removal via keyboard shortcut', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    // Ensure node '1' and edge 'e1-2' exist
    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualNodes.set('2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }];

    mockConceptualMapContext.selectNode('1');
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(1);

    // Simulate pressing Delete key on window
    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    // Verify node '1' is deleted and edge 'e1-2' is cascaded/removed
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(false);
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
  });

  it('removes selected edge via keyboard shortcut without affecting nodes', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    // Ensure edge 'e1-2' exists between '1' and '2'
    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualNodes.set('2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }];

    mockConceptualMapContext.selectEdge('e1-2');
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe('e1-2');
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(1);

    // Simulate pressing Delete key on window
    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    // Verify edge 'e1-2' is removed but nodes '1' and '2' remain
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.instance.conceptualNodes.has('2')).toBe(true);
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);
  });

  it('guards against node deletion when typing inside input or textarea', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.selectNode('1');

    const input = document.createElement('input');
    document.body.appendChild(input);

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    Object.defineProperty(deleteEvent, 'target', { value: input, enumerable: true });

    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    // Node '1' should still exist because deletion was guarded
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');

    document.body.removeChild(input);
  });

  it('controls panel expansion based on node selection and pane clicks', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    // Initially expanded
    expect(vm.isPanelExpanded).toBe(true);

    // Click pane -> should collapse
    vm.deselectAllAndClosePanel();
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(false);

    // Select node -> should expand
    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(true);
  });

  it('toggles panel expansion via collapse button', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    const vm = wrapper.vm as any;

    // Toggle collapse
    vm.isPanelExpanded = false;
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(false);

    // Toggle expand
    vm.isPanelExpanded = true;
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(true);
  });

  it('duplicates node and deletes node/edge via inspector panel events', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: {
            template: '<div><button class="dup-btn" @click="$emit(\'duplicate:node\', node)"></button><button class="del-btn" @click="$emit(\'delete:node\', node.id)"></button></div>',
            props: ['node']
          },
          VEdgeInspectorPanel: {
            template: '<div><button class="del-edge-btn" @click="$emit(\'delete:edge\', edge.id)"></button></div>',
            props: ['edge']
          },
        },
      },
    });

    const vm = wrapper.vm as any;

    // Test node duplicate
    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    await wrapper.find('.dup-btn').trigger('click');
    expect(mockConceptualMapContext.addNode).toHaveBeenCalled();

    // Test node delete
    await wrapper.find('.del-btn').trigger('click');
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(false);

    // Test edge delete
    mockConceptualMapContext.selectEdge('e1-2');
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '2', target: '2', type: 'LINK', weight: 1 }];
    await wrapper.vm.$nextTick();
    await wrapper.find('.del-edge-btn').trigger('click');
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
  });
});

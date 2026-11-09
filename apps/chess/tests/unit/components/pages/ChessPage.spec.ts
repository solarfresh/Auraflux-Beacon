import ChessPage from '@/components/pages/ChessPage.vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive, ref } from 'vue';

beforeEach(() => {
  vi.clearAllMocks();
  mockConceptualMapContext.selectedNodeId.value = null;
  mockConceptualMapContext.selectedEdgeId.value = null;
});

// Mock conceptual map context
const mockConceptualMapContext = {
  instance: reactive({
    conceptualNodes: new Map([
      ['1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 } }],
      ['2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 } }],
    ]),
    conceptualEdges: [{ id: 'e1-2', source: '1', target: '2' }],
  }),
  selectedNodeId: ref<string | null>(null),
  selectedEdgeId: ref<string | null>(null),
  addNode: vi.fn(),
  addEdge: vi.fn(),
  updateNode: vi.fn(),
  updateEdge: vi.fn((id: string, updatedEdge: any) => {
    const idx = mockConceptualMapContext.instance.conceptualEdges.findIndex(e => e.id === id);
    if (idx !== -1) {
      mockConceptualMapContext.instance.conceptualEdges[idx] = updatedEdge;
    }
  }),
  selectNode: vi.fn((id: string) => {
    mockConceptualMapContext.selectedNodeId.value = id;
    mockConceptualMapContext.selectedEdgeId.value = null;
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

  it('adds a new conceptual node when clicking Add Node button', async () => {
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

    expect(mockConceptualMapContext.addNode).toHaveBeenCalled();
  });

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

  it('renders horizontal dual-pane layout and conditionally toggles sidebar inspector when node is selected', async () => {
    mockConceptualMapContext.selectedNodeId.value = null;
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

    const mainContainer = wrapper.find('.flex-row');
    expect(mainContainer.exists()).toBe(true);

    // Initially no node selected -> sidebar should not exist
    await wrapper.vm.$nextTick();
    expect(wrapper.find('aside').exists()).toBe(false);

    // Select a node -> sidebar should appear
    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('aside').exists()).toBe(true);
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

    mockConceptualMapContext.selectEdge('e1-2');
    await wrapper.vm.$nextTick();

    const inspector = wrapper.findComponent({ name: 'VEdgeInspectorPanel' });
    const updatedEdgeData = { id: 'e1-2', weight: 3, type: 'ASSOCIATION' };
    inspector.vm.$emit('update:edge', updatedEdgeData);
    await wrapper.vm.$nextTick();

    // Verify local state update since updateEdgeInContext is internal
    const vm = wrapper.vm as any;
    expect(vm.selectedEdge.weight).toBe(3);
    expect(vm.selectedEdge.type).toBe('ASSOCIATION');
  });
});

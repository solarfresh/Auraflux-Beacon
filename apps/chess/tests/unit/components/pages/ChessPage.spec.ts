import ChessPage from '@/components/pages/ChessPage.vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive, ref } from 'vue';

beforeEach(() => {
  vi.clearAllMocks();
  mockConceptualMapContext.selectedNodeId.value = null;
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
  addNode: vi.fn(),
  addEdge: vi.fn(),
  updateNode: vi.fn(),
  selectNode: vi.fn((id: string) => { mockConceptualMapContext.selectedNodeId.value = id; }),
  deselectAllNodes: vi.fn(() => { mockConceptualMapContext.selectedNodeId.value = null; }),
  isNodeSelected: vi.fn((id: string) => mockConceptualMapContext.selectedNodeId.value === id),
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
    expect(vm.isNodeSelected('1')).toBe(true);

    // Deselect node
    vm.deselectAllNodes();
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
    expect(vm.isNodeSelected('1')).toBe(false);
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
});

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ChessPage from '../../src/components/pages/ChessPage.vue';

// Mock conceptual map context
const mockConceptualMapContext = {
  instance: {
    conceptualNodes: new Map([
      ['1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 } }],
      ['2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 } }]
    ]),
    conceptualEdges: [
      { id: 'e1-2', source: '1', target: '2' }
    ]
  },
  addNode: vi.fn(),
  addEdge: vi.fn(),
};

vi.mock('../../../packages/shared-core/src/composables/useConceptualMapContext', () => ({
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
});

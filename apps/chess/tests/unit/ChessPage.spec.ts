import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChessPage from '../../src/components/pages/ChessPage.vue';

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

    // Access vm nodes via component setup state or inspection
    const vm = wrapper.vm as any;
    expect(vm.nodes.length).toBe(3);

    const newNode = vm.nodes[vm.nodes.length - 1];
    expect(newNode.id).toBeDefined();
    expect(newNode.type).toBe('CONCEPT');
    expect(newNode.label).toBe('New Concept');
    expect(typeof newNode.position.x).toBe('number');
    expect(typeof newNode.position.y).toBe('number');
  });

  it('handles onConnect with self-loop prevention and valid connections', () => {
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
    const initialEdgesLength = vm.edges.length;

    // Spy on console.warn
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Test self-loop connection (source === target)
    vm.onConnect({ source: '1', target: '1', sourceHandle: null, targetHandle: null });
    expect(consoleWarnSpy).toHaveBeenCalledWith('Reject self-loop connection');
    expect(vm.edges.length).toBe(initialEdgesLength);

    consoleWarnSpy.mockRestore();

    // Test valid connection
    vm.onConnect({ source: '1', target: '3', sourceHandle: null, targetHandle: null });
    expect(vm.edges.length).toBe(initialEdgesLength + 1);
  });
});

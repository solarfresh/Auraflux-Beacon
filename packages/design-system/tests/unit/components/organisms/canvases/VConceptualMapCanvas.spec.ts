import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VConceptualMapCanvas from '@auraflux/design-system/components/organisms/canvases/VConceptualMapCanvas.vue';

describe('ConceptualMapCanvas.vue', () => {
  it('renders correctly with nodes and edges', () => {
    const warnSpy = vi.spyOn(console, 'warn');
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [{ id: '1', label: 'Test', type: 'CONCEPT' }],
        edges: []
      }
    });
    expect(wrapper.find('.conceptual-map-canvas').exists()).toBe(true);

    const warningCalls = warnSpy.mock.calls.filter(call =>
      call[0].toString().includes('The Vue Flow parent container needs a width and a height')
    );
    expect(warningCalls.length).toBe(1);
    warnSpy.mockRestore();
  });

  it('emits connect event when valid connection occurs', async () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [
          { id: '1', label: 'Node 1', type: 'CONCEPT' },
          { id: '2', label: 'Node 2', type: 'CONCEPT' }
        ],
        edges: []
      }
    });

    const vm = wrapper.vm as any;
    vm.onConnect({ source: '1', target: '2', sourceHandle: null, targetHandle: null });

    expect(wrapper.emitted('connect')).toBeTruthy();
    expect(wrapper.emitted('connect')?.[0][0]).toEqual({ source: '1', target: '2', sourceHandle: null, targetHandle: null });
  });

  it('prevents connect event on self-loop', async () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [
          { id: '1', label: 'Node 1', type: 'CONCEPT' }
        ],
        edges: []
      }
    });

    const vm = wrapper.vm as any;
    vm.onConnect({ source: '1', target: '1', sourceHandle: null, targetHandle: null });

    expect(wrapper.emitted('connect')).toBeFalsy();
  });

  it('emits update:selectedNodeId on node click', async () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [{ id: '1', label: 'Node 1', type: 'CONCEPT' }],
        edges: []
      }
    });

    const vm = wrapper.vm as any;
    vm.onNodeClick({ node: { id: '1' } });

    expect(wrapper.emitted('update:selectedNodeId')).toBeTruthy();
    expect(wrapper.emitted('update:selectedNodeId')?.[0][0]).toBe('1');
  });

  it('respects isEditing prop', async () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [{ id: '1', label: 'Node 1', type: 'CONCEPT' }],
        edges: [],
        isEditing: false
      }
    });
    expect(wrapper.props('isEditing')).toBe(false);
  });
});


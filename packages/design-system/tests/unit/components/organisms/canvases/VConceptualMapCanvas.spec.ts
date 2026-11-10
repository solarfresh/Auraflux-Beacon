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
      },
      global: {
        provide: {
          'vue-flow': {
            viewport: { x: 0, y: 0, zoom: 1 },
            dimensions: { width: 1000, height: 1000 }
          }
        }
      }
    });
    expect(wrapper.find('.conceptual-map-canvas').exists()).toBe(true);

    const warningCalls = warnSpy.mock.calls.filter(call =>
      !call.toString().includes('The Vue Flow parent container needs a width and a height')
    );
    expect(warningCalls.length).toBe(0);
    warnSpy.mockRestore();
  });

  it('handles null or undefined selectedEdgeId edge case correctly', () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [],
        edges: [{ id: 'e1', source: '1', target: '2', type: 'VALIDATES', weight: 1 }],
        selectedEdgeId: null
      }
    });
    const vm = wrapper.vm as any;
    expect(vm.mappedEdges[0].selected).toBe(false);
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

  it('emits update:selectedEdgeId and edge-click on edge click', async () => {
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [],
        edges: [{ id: 'e1-2', source: '1', target: '2', type: 'VALIDATES', weight: 1 }]
      }
    });

    const vm = wrapper.vm as any;
    vm.onEdgeClick({ edge: { id: 'e1-2' } });

    expect(wrapper.emitted('edge-click')).toBeTruthy();
    expect(wrapper.emitted('edge-click')?.[0][0]).toEqual({ id: 'e1-2' });
    expect(wrapper.emitted('update:selectedEdgeId')).toBeTruthy();
    expect(wrapper.emitted('update:selectedEdgeId')?.[0][0]).toBe('e1-2');
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


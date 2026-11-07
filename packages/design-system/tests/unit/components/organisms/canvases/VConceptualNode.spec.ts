import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
import { ConceptualMapContextKey } from '@auraflux/design-system/constants/injection-keys';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@vue-flow/core', async () => {
  const actual = await vi.importActual<any>('@vue-flow/core');
  return {
    ...actual,
    useVueFlow: () => ({
      nodes: [],
      edges: [],
      dimensions: { width: 100, height: 100 }
    }),
    Handle: {
      name: 'Handle',
      template: '<div />'
    }
  };
});

describe('VConceptualNode', () => {
  it('should fallback and render correctly when used without ConceptualMapContext', () => {
    // Suppress console warning/error if any
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(VConceptualNode as any, {
      props: {
        id: '1',
        type: 'default',
        selected: false,
        connectable: true,
        position: { x: 0, y: 0 },
        dimensions: { width: 100, height: 100 },
        data: {
          label: 'Test Node',
          type: 'EVENT',
          status: 'DRAFT',
          content: 'Node Content'
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    spy.mockRestore();
  });

  it('should render correctly when provided with valid context', () => {
    const wrapper = mount(VConceptualNode as any, {
      props: {
        id: '1',
        type: 'default',
        selected: false,
        connectable: true,
        position: { x: 0, y: 0 },
        dimensions: { width: 100, height: 100 },
        data: {
          label: 'Test Node',
          type: 'EVENT',
          status: 'DRAFT',
          content: 'Node Content'
        }
      },
      global: {
        provide: {
          [ConceptualMapContextKey]: {
            // Mock context
          }
        },
        stubs: {
          VNodeLabelContainer: true,
          VCluster: true,
          VTypography: true,
          VStack: true
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should accept a node with handles property', () => {
    const wrapper = mount(VConceptualNode as any, {
      props: {
        id: '2',
        type: 'default',
        selected: false,
        connectable: true,
        position: { x: 10, y: 10 },
        dimensions: { width: 100, height: 100 },
        data: {
          label: 'Node with Handles',
          type: 'CONCEPT',
          status: 'ACTIVE',
          handles: [
            {
              id: 'h1',
              type: 'source',
              position: { x: 0, y: 0 }
            }
          ]
        }
      },
      global: {
        provide: {
          [ConceptualMapContextKey]: {}
        },
        stubs: {
          NodeLabelContainer: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});

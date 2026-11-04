import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
import { ConceptualMapContextKey } from '@auraflux/design-system/constants/injection-keys';

describe('VConceptualNode', () => {
  it('should throw error when used without ConceptualMapContext', () => {
    // Suppress console error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      mount(VConceptualNode as any, {
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
    }).toThrowError('VConceptualNode must be used within a ConceptualMapContext provider');

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
          NodeLabelContainer: true,
          VCluster: true,
          VTypography: true,
          VStack: true
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});

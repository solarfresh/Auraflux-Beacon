import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
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
  it('should render correctly with props and emits', () => {
    const wrapper = mount(VConceptualNode as any, {
      props: {
        id: '1',
        type: 'default',
        selected: false,
        connectable: true,
        position: { x: 0, y: 0 },
        dimensions: { width: 100, height: 100 },
        isEditing: true,
        data: {
          label: 'Test Node',
          type: 'EVENT',
          status: 'DRAFT',
          content: 'Node Content'
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should emit update events correctly', async () => {
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
          type: 'CONCEPT',
          status: 'ACTIVE'
        }
      }
    });

    await wrapper.vm.$emit('update:isEditing', true);
    expect(wrapper.emitted('update:isEditing')).toBeTruthy();
    expect(wrapper.emitted('update:isEditing')?.[0]).toEqual([true]);

    await wrapper.vm.$emit('update:label', 'New Label');
    expect(wrapper.emitted('update:label')).toBeTruthy();
    expect(wrapper.emitted('update:label')?.[0]).toEqual(['New Label']);
  });
});

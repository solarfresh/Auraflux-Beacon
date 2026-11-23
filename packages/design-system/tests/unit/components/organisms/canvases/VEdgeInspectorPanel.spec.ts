import VActionGroup from '@auraflux/design-system/components/organisms/navs/VActionGroup.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import VEdgeInspectorPanel from '@auraflux/design-system/components/organisms/canvases/VEdgeInspectorPanel.vue';
import type { ConceptualEdge } from '@auraflux/design-system/interfaces/conceptual-map';

describe('VEdgeInspectorPanel', () => {
  const mockEdge: ConceptualEdge = {
    id: 'test-edge',
    source: 'node-1',
    target: 'node-2',
    label: 'Test Label',
    type: 'VALIDATES',
    weight: 3,
    evidence: 'Some evidence'
  };

  it('renders correctly with props', () => {
    const wrapper = mount(VEdgeInspectorPanel, {
      props: { edge: mockEdge }
    });

    expect(wrapper.findComponent({ name: 'VInput' }).props('modelValue')).toBe('Test Label');
    expect(wrapper.findComponent({ name: 'VSelect' }).props('modelValue')).toBe('VALIDATES');
    expect(wrapper.find('div').text()).toContain('Weight: 3');
    expect(wrapper.findComponent({ name: 'VTextarea' }).props('modelValue')).toBe('Some evidence');
  });

  it('emits update:edge with updated data when save action is triggered', async () => {
    const wrapper = mount(VEdgeInspectorPanel, {
      props: { edge: mockEdge }
    });

    // Simulate editing
    await wrapper.findComponent({ name: 'VInput' }).setValue('New Label');

    const actionGroup = wrapper.findComponent(VActionGroup);
    await actionGroup.vm.$emit('action', 'update');

    expect(wrapper.emitted('update:edge')).toBeTruthy();
    const emittedData = wrapper.emitted('update:edge')![0][0] as ConceptualEdge;
    expect(emittedData).toEqual({
      ...mockEdge,
      label: 'New Label'
    });
  });

  it('restricts weight within 1 to 5', async () => {
    const wrapper = mount(VEdgeInspectorPanel, {
      props: { edge: { ...mockEdge, weight: 0 } }
    });

    const actionGroup = wrapper.findComponent(VActionGroup);
    await actionGroup.vm.$emit('action', 'update');

    const emitted1 = wrapper.emitted('update:edge')![0][0] as ConceptualEdge;
    expect(emitted1.weight).toBe(1);

    await wrapper.findComponent({ name: 'VSlider' }).setValue(6);
    await actionGroup.vm.$emit('action', 'update');

    const emitted2 = wrapper.emitted('update:edge')![1][0] as ConceptualEdge;
    expect(emitted2.weight).toBe(5);
  });

  it('emits delete:edge when delete action is triggered', async () => {
    const wrapper = mount(VEdgeInspectorPanel, {
      props: { edge: mockEdge }
    });

    const actionGroup = wrapper.findComponent(VActionGroup);
    await actionGroup.vm.$emit('action', 'delete');

    expect(wrapper.emitted('delete:edge')).toBeTruthy();
    expect(wrapper.emitted('delete:edge')![0][0]).toEqual('test-edge');
  });
});

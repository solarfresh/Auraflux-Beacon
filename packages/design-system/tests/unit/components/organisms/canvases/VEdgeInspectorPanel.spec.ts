import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
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

  it('emits update:edge with updated data when save is clicked', async () => {
    const wrapper = mount(VEdgeInspectorPanel, {
      props: { edge: mockEdge }
    });

    // Simulate editing
    await wrapper.findComponent({ name: 'VInput' }).setValue('New Label');
    await wrapper.findComponent({ name: 'VButton' }).trigger('click');

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

    await wrapper.findComponent({ name: 'VButton' }).trigger('click');

    const emitted1 = wrapper.emitted('update:edge')![0][0] as ConceptualEdge;
    expect(emitted1.weight).toBe(1);

    await wrapper.findComponent({ name: 'VSlider' }).setValue(6);
    await wrapper.findComponent({ name: 'VButton' }).trigger('click');

    const emitted2 = wrapper.emitted('update:edge')![1][0] as ConceptualEdge;
    expect(emitted2.weight).toBe(5);
  });
});

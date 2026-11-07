import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VNodeLabelContainer from '@auraflux/design-system/components/molecules/canvases/VNodeLabelContainer.vue';
import VNodeHandle from '@auraflux/design-system/components/atoms/canvases/VNodeHandle.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';

// Mocking @vue-flow/core Handle used by VNodeHandle
vi.mock('@vue-flow/core', () => ({
  Handle: {
    name: 'Handle',
    template: '<div class="mock-handle"></div>'
  }
}));

describe('VNodeLabelContainer', () => {
  const defaultProps = {
    id: 'node-1',
    label: 'Test Node',
    type: 'CONCEPT',
    rationale: 'Test Rationale'
  };

  it('renders label and type correctly', () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    expect(wrapper.text()).toContain('Test Node');
  });

  it('renders rationale when provided', () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    expect(wrapper.text()).toContain('Test Rationale');
  });

  it('does not render rationale when not provided', () => {
    const wrapper = mount(VNodeLabelContainer, {
      props: { id: 'node-1', label: 'Test Node', type: 'CONCEPT' }
    });
    // Assuming rationale is rendered within a footer element in the component
    const rationale = wrapper.find('.footer');
    expect(rationale.exists()).toBe(false);
  });

  it('renders slots correctly', () => {
    const wrapper = mount(VNodeLabelContainer, {
      props: defaultProps,
      slots: {
        header: '<div class="header">Header</div>',
        default: '<div class="content">Content</div>'
      }
    });
    expect(wrapper.find('.header').exists()).toBe(true);
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('renders VNodeHandles when handles prop is provided', () => {
    const wrapper = mount(VNodeLabelContainer, {
      props: {
        ...defaultProps,
        handles: [
          { id: 'handle-top', type: 'target', position: 'top' },
          { id: 'handle-bottom', type: 'source', position: 'bottom' }
        ]
      }
    });
    const handles = wrapper.findAllComponents(VNodeHandle);
    expect(handles.length).toBe(2);
    expect(handles.at(0)?.props('id')).toBe('handle-top');
    expect(handles.at(1)?.props('id')).toBe('handle-bottom');
  });

  it('warns when mandatory fields are missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(VNodeLabelContainer, {
      props: { id: '', label: '', type: 'CONCEPT' } as any
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('switches to edit mode on double-click', async () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    await wrapper.trigger('dblclick');
    expect(wrapper.findComponent(VInput).exists()).toBe(true);
  });

  it('cancels edit and reverts on Esc key', async () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    await wrapper.trigger('dblclick');
    const input = wrapper.findComponent(VInput);
    await input.setValue('Changed');
    await input.trigger('keydown.esc');
    expect(wrapper.findComponent(VInput).exists()).toBe(false);
    expect(wrapper.text()).toContain('Test Node');
  });

  it('emits update:label on edit completion', async () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    await wrapper.trigger('dblclick');
    const input = wrapper.findComponent(VInput);
    await input.setValue('Updated Node');
    await input.trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('update:label');
    expect(wrapper.emitted()['update:label'][0]).toEqual(['Updated Node']);
  });

  it('does not emit update:label if input is empty', async () => {
    const wrapper = mount(VNodeLabelContainer, { props: defaultProps });
    await wrapper.trigger('dblclick');
    const input = wrapper.findComponent(VInput);
    await input.setValue('');
    await input.trigger('blur');
    expect(wrapper.emitted()).not.toHaveProperty('update:label');
  });

  it('does not switch to edit mode when isEditable is false', async () => {
    const wrapper = mount(VNodeLabelContainer, {
      props: { ...defaultProps, isEditable: false }
    });
    await wrapper.trigger('dblclick');
    expect(wrapper.findComponent(VInput).exists()).toBe(false);
  });
});

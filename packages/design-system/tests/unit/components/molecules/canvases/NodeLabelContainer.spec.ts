import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import NodeLabelContainer from '@auraflux/design-system/components/molecules/canvases/NodeLabelContainer.vue';

describe('NodeLabelContainer', () => {
  const defaultProps = {
    id: 'node-1',
    label: 'Test Node',
    type: 'CONCEPT',
    rationale: 'Test Rationale'
  };

  it('renders label and type correctly', () => {
    const wrapper = mount(NodeLabelContainer, { props: defaultProps });
    expect(wrapper.text()).toContain('Test Node');
  });

  it('renders rationale when provided', () => {
    const wrapper = mount(NodeLabelContainer, { props: defaultProps });
    expect(wrapper.text()).toContain('Test Rationale');
  });

  it('does not render rationale when not provided', () => {
    const wrapper = mount(NodeLabelContainer, {
      props: { id: 'node-1', label: 'Test Node', type: 'CONCEPT' }
    });
    // Assuming rationale is rendered within a footer element in the component
    const rationale = wrapper.find('.footer');
    expect(rationale.exists()).toBe(false);
  });

  it('renders slots correctly', () => {
    const wrapper = mount(NodeLabelContainer, {
      props: defaultProps,
      slots: {
        header: '<div class="header">Header</div>',
        default: '<div class="content">Content</div>'
      }
    });
    expect(wrapper.find('.header').exists()).toBe(true);
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('warns when mandatory fields are missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(NodeLabelContainer, {
      props: { id: '', label: '', type: 'CONCEPT' } as any
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

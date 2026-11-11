import VInspectorPanel from '@auraflux/design-system/components/organisms/layout/VInspectorPanel.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('VInspectorPanel', () => {
  it('renders content when isExpanded is true', () => {
    const wrapper = mount(VInspectorPanel, {
      props: { isExpanded: true },
      slots: { default: '<div class="content">Content</div>' },
    });
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('does not render content when isExpanded is false', () => {
    const wrapper = mount(VInspectorPanel, {
      props: { isExpanded: false },
      slots: { default: '<div class="content">Content</div>' },
    });
    expect(wrapper.find('.content').exists()).toBe(false);
  });

  it('emits toggle and update:isExpanded events when edge tab button is clicked', async () => {
    const wrapper = mount(VInspectorPanel, {
      props: { isExpanded: true },
    });

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('update:isExpanded')).toEqual([[false]]);
  });
});

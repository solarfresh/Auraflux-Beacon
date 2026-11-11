import VPanelHeader from '@auraflux/design-system/components/molecules/layout/VPanelHeader.vue';
import VInspectorPanel from '@auraflux/design-system/components/organisms/layout/VInspectorPanel.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('VInspectorPanel', () => {
  it('renders content when isExpanded is true', () => {
    const wrapper = mount(VInspectorPanel, {
      props: { title: 'Test Panel', isExpanded: true },
      slots: { default: '<div class="content">Content</div>' },
      global: {
        stubs: { VPanelHeader: true }
      }
    });
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('does not render content when isExpanded is false', () => {
    const wrapper = mount(VInspectorPanel, {
      props: { title: 'Test Panel', isExpanded: false },
      slots: { default: '<div class="content">Content</div>' },
      global: {
        stubs: { VPanelHeader: true }
      }
    });
    expect(wrapper.find('.content').exists()).toBe(false);
  });

  it('emits toggle event when header is toggled', async () => {
    const wrapper = mount(VInspectorPanel, {
      props: { title: 'Test Panel', isExpanded: true },
      global: {
        stubs: { VPanelHeader: {
          template: '<div @click="$emit(\'toggle\')">Header</div>'
        }}
      }
    });
    await wrapper.findComponent(VPanelHeader).vm.$emit('toggle');
    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('update:isExpanded')).toEqual([[false]]);
  });
});

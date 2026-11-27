import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('VDropdownItem', () => {
  it('renders with isTruncated default to true', () => {
    const wrapper = mount(VDropdownItem, {
      slots: { default: 'Item Text' },
    });
    const typography = wrapper.findComponent({ name: 'VTypography' });
    expect(typography.classes()).toContain('truncate');
  });

  it('removes truncate class when isTruncated is false', () => {
    const wrapper = mount(VDropdownItem, {
      props: { isTruncated: false },
      slots: { default: 'Item Text' },
    });
    const typography = wrapper.findComponent({ name: 'VTypography' });
    expect(typography.classes()).not.toContain('truncate');
  });

  it('includes truncate class when isTruncated is true', () => {
    const wrapper = mount(VDropdownItem, {
      props: { isTruncated: true },
      slots: { default: 'Item Text' },
    });
    const typography = wrapper.findComponent({ name: 'VTypography' });
    expect(typography.classes()).toContain('truncate');
  });
});

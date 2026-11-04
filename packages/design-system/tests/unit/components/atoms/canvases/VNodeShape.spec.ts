import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VNodeShape from '@auraflux/design-system/components/atoms/canvases/VNodeShape.vue';

describe('VNodeShape', () => {
  it('renders correctly with LOCKED status', () => {
    const wrapper = mount(VNodeShape, {
      props: { status: 'LOCKED' }
    });
    // Check if the rect element has the correct class
    expect(wrapper.find('rect').classes()).toContain('stroke-solid');
  });

  it('renders correctly with REVIEW status', () => {
    const wrapper = mount(VNodeShape, {
      props: { status: 'REVIEW' }
    });
    // Check if the rect element has the correct class
    expect(wrapper.find('rect').classes()).toContain('stroke-dash');
  });
});

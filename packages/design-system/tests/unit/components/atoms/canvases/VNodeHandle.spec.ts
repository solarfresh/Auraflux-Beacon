import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VNodeHandle from '@auraflux/design-system/components/atoms/canvases/VNodeHandle.vue';

// Mocking @vue-flow/core Handle
vi.mock('@vue-flow/core', () => ({
  Handle: {
    name: 'Handle',
    template: '<div class="mock-handle"></div>'
  }
}));

describe('VNodeHandle', () => {
  it('renders correctly with required props', () => {
    const wrapper = mount(VNodeHandle, {
      props: { id: 'test-handle', position: 'top', type: 'source' }
    });
    expect(wrapper.find('.mock-handle').exists()).toBe(true);
  });
});

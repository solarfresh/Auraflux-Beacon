import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';

describe('VDropdownMenu.vue', () => {
  it('renders correctly when modelValue is true', () => {
    const wrapper = mount(VDropdownMenu, {
      props: {
        modelValue: true,
      },
      slots: {
        default: '<div class="item">Item 1</div>',
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });
    expect(wrapper.find('.item').text()).toBe('Item 1');
  });

  it('emits update:modelValue when overlay is clicked', async () => {
    const wrapper = mount(VDropdownMenu, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });
    // The VBox overlay has fixed inset-0
    const overlay = wrapper.findComponent({ name: 'VBox' }); // VBox is used for the overlay
    await overlay.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('emits select event and closes menu when item is selected via handleSelect', async () => {
    const wrapper = mount(VDropdownMenu, {
      props: {
        modelValue: true,
      },
    });
    (wrapper.vm as any).handleSelect('test-value');
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0]).toEqual(['test-value']);
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });
});
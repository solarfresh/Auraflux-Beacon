import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
import VActionGroup from '@auraflux/design-system/components/organisms/navs/VActionGroup.vue';
import type { ActionDefinition } from '@auraflux/design-system/interfaces/navs';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('VActionGroup', () => {
  const mockActions: ActionDefinition[] = [
    { id: '1', label: 'Action 1', iconName: 'icon1', onClick: vi.fn() },
    { id: '2', label: 'Action 2', iconName: 'icon2', onClick: vi.fn() },
    { id: '3', label: 'Action 3', iconName: 'icon3', onClick: vi.fn() },
    { id: '4', label: 'Action 4', iconName: 'icon4', onClick: vi.fn() },
  ];

  it('renders correctly with given actions', () => {
    const wrapper = mount(VActionGroup, {
      props: { actions: mockActions.slice(0, 3), maxVisible: 3 }
    });

    expect(wrapper.findAllComponents(VButton).length).toBe(3);
  });

  it('collapses actions into dropdown when maxVisible is exceeded', () => {
    const wrapper = mount(VActionGroup, {
      props: { actions: mockActions, maxVisible: 2 }
    });

    expect(wrapper.findAllComponents(VButton).length).toBe(2);
    expect(wrapper.findComponent(VDropdownMenu).exists()).toBe(true);
  });

  it('disabled state reflects on buttons', () => {
    const wrapper = mount(VActionGroup, {
      props: { actions: mockActions.slice(0, 1), disabled: true }
    });

    const button = wrapper.findComponent(VButton);
    expect(button.props('disabled')).toBe(true);
  });

  it('renders tooltips when provided', () => {
    const actionsWithTooltips: ActionDefinition[] = [
      { id: '1', label: 'Action 1', iconName: 'icon1', tooltip: 'Test Tooltip', onClick: vi.fn() },
    ];
    const wrapper = mount(VActionGroup, {
      props: { actions: actionsWithTooltips }
    });

    const tooltip = wrapper.findComponent({ name: 'VTooltip' });
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.props('content')).toBe('Test Tooltip');
  });
});

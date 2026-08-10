import type { Meta, StoryObj } from '@storybook/vue3';
import VHeaderActions from '@auraflux/design-system/components/organisms/navs/VHeaderActions.vue';

const defaultSettingItems = [
  { label: 'Model Providers', iconName: 'CpuChip', route: '/settings/models' },
  { label: 'System Preferences', iconName: 'Cog8Tooth', route: '/settings/preferences' },
];

const meta = {
  title: 'Organisms/Navs/VHeaderActions',
  component: VHeaderActions,
  tags: ['autodocs'],
  args: {
    settingItems: defaultSettingItems,
  },
  argTypes: {
    settingItems: { control: 'object' },
  },
  parameters: {
    actions: {
      handles: [
        'toggle-notifications',
        'click-setting',
        'open-profile',
        'logout',
      ],
    },
  },
} satisfies Meta<typeof VHeaderActions>;

export default meta;
type Story = StoryObj<typeof VHeaderActions>;

/**
 * Default usage: Standard header action items including notifications, settings dropdown, and user menu.
 */
export const Default: Story = {};

/**
 * Custom Settings Items: Demonstrates setting custom navigation links within the settings dropdown menu.
 */
export const CustomSettings: Story = {
  args: {
    settingItems: [
      { label: 'API Keys', iconName: 'Key', route: '/settings/keys' },
      { label: 'Billing & Plans', iconName: 'CreditCard', route: '/settings/billing' },
      { label: 'Team Members', iconName: 'Users', route: '/settings/team' },
    ],
  },
};

/**
 * Empty Settings: Header actions rendered without any dropdown items configured for system settings.
 */
export const EmptySettings: Story = {
  args: {
    settingItems: [],
  },
};
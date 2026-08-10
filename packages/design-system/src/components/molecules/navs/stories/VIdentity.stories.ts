import type { Meta, StoryObj } from '@storybook/vue3';
import VIdentity, { type VIdentityProps } from '@auraflux/design-system/components/molecules/navs/VIdentity.vue';

const meta = {
  title: 'Molecules/Navs/VIdentity',
  component: VIdentity,
  tags: ['autodocs'],
  args: {
    showBack: false,
    title: 'Workspace',
    section: 'Project Dashboard',
  },
  argTypes: {
    showBack: { control: 'boolean' },
    title: { control: 'text' },
    section: { control: 'text' },
  },
} satisfies Meta<VIdentityProps>;

export default meta;
type Story = StoryObj<typeof VIdentity>;

/**
 * Default usage: Standard identity display showing the current workspace and active section.
 */
export const Default: Story = {
  args: {
    title: 'AuraFlux',
    section: 'System Settings',
  },
};

/**
 * With Back Button: Useful when navigating deeper into a workspace hierarchy, allowing the user to return to the previous view.
 */
export const WithBackButton: Story = {
  args: {
    showBack: true,
    title: 'Project Alpha',
    section: 'Consultation',
  },
  parameters: {
    actions: { handles: ['back'] },
  },
};

/**
 * Minimal: Identity display without an explicit section label.
 */
export const Minimal: Story = {
  args: {
    title: 'Dashboard',
    section: undefined,
  },
};
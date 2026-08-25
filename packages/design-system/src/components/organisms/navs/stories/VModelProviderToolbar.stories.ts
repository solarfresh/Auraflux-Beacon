import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VModelProviderToolbar from '@auraflux/design-system/components/organisms/navs/VModelProviderToolbar.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Organisms/Navs/VModelProviderToolbar',
  component: VModelProviderToolbar,
  tags: ['autodocs'],
  args: {
    title: 'Model Providers',
    description: 'Configure LLM API credentials, endpoints, and monitor operational health.',
    sticky: true,
    intent: 'neutral',
    surface: 'base',
    border: 'none',
    padding: 'none',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    sticky: { control: 'boolean' },
    intent: { control: 'select', options: ['neutral', 'brand', 'warning', 'danger', 'success'] },
    surface: { control: 'select', options: ['base', 'soft', 'ghost', 'subtle'] },
  },
} satisfies Meta<typeof VModelProviderToolbar>;

export default meta;
type Story = StoryObj<typeof VModelProviderToolbar>;

/**
 * Default Usage: Standard model provider management toolbar with a primary action button.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VModelProviderToolbar },
    setup() {
      const handleCreate = () => alert('Add Provider clicked!');
      return { args, handleCreate };
    },
    template: `
      <VModelProviderToolbar
        v-bind="args"
        @create="handleCreate"
      />
    `,
  }),
};

/**
 * Custom Title & Description: Useful for scoped environments (e.g., Project-specific LLM settings).
 */
export const CustomContent: Story = {
  args: {
    title: 'Project Credentials',
    description: 'Manage override API keys and private proxy endpoints for this workspace.',
  },
  render: (args) => ({
    components: { VModelProviderToolbar },
    setup() {
      const handleCreate = () => console.log('Create override triggered');
      return { args, handleCreate };
    },
    template: `
      <VModelProviderToolbar
        v-bind="args"
        @create="handleCreate"
      />
    `,
  }),
};

/**
 * Non-Sticky Mode: Static header positioning for modal or constrained layout containers.
 */
export const NonSticky: Story = {
  args: {
    sticky: false,
  },
  render: (args) => ({
    components: { VBox, VModelProviderToolbar, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox class="border border-slate-200 rounded-lg overflow-hidden">
        <VModelProviderToolbar v-bind="args" />
        <VTypography class="p-6 bg-slate-50 text-slate-500 text-sm h-32">
          Page content area below static toolbar.
        </VTypography>
      </VBox>
    `,
  }),
};
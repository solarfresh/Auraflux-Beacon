import type { Meta, StoryObj } from '@storybook/vue3';
import VInteractivePlaceholder, {type VInteractivePlaceholderProps} from '@auraflux/design-system/components/molecules/resources/VInteractivePlaceholder.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

const meta = {
  title: 'Molecules/Resources/VInteractivePlaceholder',
  component: VInteractivePlaceholder,
  tags: ['autodocs'],
  args: {
    iconName: 'Plus',
    label: 'Add New Item',
    border: 'dashed',
    surface: 'soft',
    attention: 'secondary',
    intent: 'neutral',
    rounded: 'xl',
    size: 'lg',
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<VInteractivePlaceholderProps>;

export default meta;
type Story = StoryObj<typeof VInteractivePlaceholder>;

/**
 * Default usage: A standard interactive placeholder used to invite user creation[cite: 2].
 */
export const Default: Story = {
  render: (args) => ({
    components: { VInteractivePlaceholder, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="w-64 h-48">
        <VInteractivePlaceholder v-bind="args" />
      </VBox>
    `,
  }),
};

/**
 * Custom Label: Demonstrates overriding the default label via the slot.
 */
export const CustomLabel: Story = {
  args: {
    label: 'Upload File',
    iconName: 'ArrowUpTray',
  },
  render: (args) => ({
    components: { VInteractivePlaceholder, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="w-64 h-48">
        <VInteractivePlaceholder v-bind="args">
          Custom Label Slot
        </VInteractivePlaceholder>
      </VBox>
    `,
  }),
};

/**
 * Intent States: Demonstrates different semantic intents for various contexts (e.g., error or success).
 */
export const IntentStates: Story = {
  render: () => ({
    components: { VInteractivePlaceholder, VBox },
    template: `
      <VBox class="flex gap-4 h-48">
        <VInteractivePlaceholder intent="neutral" label="Neutral" />
        <VInteractivePlaceholder intent="success" label="Success" icon-name="Check" />
        <VInteractivePlaceholder intent="danger" label="Critical" icon-name="XMark" />
      </VBox>
    `,
  }),
};
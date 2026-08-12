import type { Meta, StoryObj } from '@storybook/vue3';
import VChip, {type VChipProps} from '@auraflux/design-system/components/molecules/indicators/VChip.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

const meta = {
  title: 'Molecules/Indicators/VChip',
  component: VChip,
  tags: ['autodocs'],
  args: {
    label: 'Entity Name',
    padding: 'sm',
    rounded: 'xl',
    border: 'all',
    attention: 'secondary',
    size: 'sm',
  },
} satisfies Meta<VChipProps>;

export default meta;
type Story = StoryObj<typeof VChip>;

/**
 * Default usage: Standard chip representing an entity or keyword.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VChip },
    setup() {
      return { args };
    },
    template: `
      <VChip v-bind="args" />
    `,
  }),
};

/**
 * Removable: Chip with a delete action for managing lists of entities.
 */
export const Removable: Story = {
  args: {
    removable: true,
    label: 'Deletable Item',
  },
  render: (args) => ({
    components: { VChip },
    setup() {
      return { args };
    },
    template: `
      <VChip v-bind="args" />
    `,
  }),
};

/**
 * With Icon: Chip showcasing an entity type indicator.
 */
export const WithIcon: Story = {
  args: {
    iconName: 'User',
    label: 'User Account',
  },
  render: (args) => ({
    components: { VChip },
    setup() {
      return { args };
    },
    template: `
      <VChip v-bind="args" />
    `,
  }),
};

/**
 * Intent-based Styling: Demonstrates different semantic intents using the design system tokens.
 */
export const SemanticIntents: Story = {
  render: (args) => ({
    components: { VChip },
    setup() {
      return { args };
    },
    template: `
      <div class="flex gap-2">
        <VChip v-bind="args" intent="info" label="Info Chip" />
        <VChip v-bind="args" intent="success" label="Success Chip" />
        <VChip v-bind="args" intent="warning" label="Warning Chip" />
        <VChip v-bind="args" intent="danger" label="Danger Chip" />
      </div>
    `,
  }),
};

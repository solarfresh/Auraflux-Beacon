import type { Meta, StoryObj } from '@storybook/vue3';
import VFieldset, { type VFieldsetProps } from '@auraflux/design-system/components/molecules/forms/VFieldset.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Molecules/Forms/VFieldset',
  component: VFieldset,
  tags: ['autodocs'],
  args: {
    title: 'General Settings',
    description: 'Configure core preferences and general identifiers for your workspace.',
    padding: 'md',
  },
} satisfies Meta<VFieldsetProps>;

export default meta;
type Story = StoryObj<typeof VFieldset>;

/**
 * Default usage: Standard form field grouping with a title and description legend.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VFieldset, VStack, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VFieldset v-bind="args">
        <VStack gap="md">
          <VBox padding="sm" surface="default" border="all" rounded="md">
            <VTypography size="xs" variant="tertiary">Workspace Name Input Field</VTypography>
          </VBox>
          <VBox padding="sm" surface="default" border="all" rounded="md">
            <VTypography size="xs" variant="tertiary">Workspace Identifier (Slug)</VTypography>
          </VBox>
        </VStack>
      </VFieldset>
    `,
  }),
};

/**
 * Title Only: A concise fieldset configuration without sub-description text.
 */
export const TitleOnly: Story = {
  args: {
    title: 'Security & Access',
    description: undefined,
  },
  render: (args) => ({
    components: { VFieldset, VStack, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VFieldset v-bind="args">
        <VStack gap="md">
          <VBox padding="sm" surface="default" border="all" rounded="md">
            <VTypography size="xs" variant="tertiary">Two-Factor Authentication Toggle</VTypography>
          </VBox>
        </VStack>
      </VFieldset>
    `,
  }),
};

/**
 * Custom Padding: Demonstrates spatial adjustments using theme tokens within complex layouts.
 */
export const LargePadding: Story = {
  args: {
    title: 'Advanced AI Parameters',
    description: 'Fine-tune temperature, tokens, and context behavior for generation models.',
    padding: 'lg',
  },
  render: (args) => ({
    components: { VFieldset, VStack, VBox, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VFieldset v-bind="args">
        <VStack gap="md">
          <VBox padding="sm" surface="default" border="all" rounded="md">
            <VTypography size="xs" variant="tertiary">Temperature Slider Control (0.0 - 1.0)</VTypography>
          </VBox>
          <VBox padding="sm" surface="default" border="all" rounded="md">
            <VTypography size="xs" variant="tertiary">Max Output Tokens Input</VTypography>
          </VBox>
          <VButton variant="primary" size="sm">Save Parameters</VButton>
        </VStack>
      </VFieldset>
    `,
  }),
};
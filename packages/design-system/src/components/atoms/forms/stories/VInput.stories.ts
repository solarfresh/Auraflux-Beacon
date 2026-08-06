import type { Meta, StoryObj } from '@storybook/vue3';
import VInput, { type VInputProps } from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Forms/VInput',
  component: VInput,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    placeholder: 'Enter something...',
    type: 'text',
    variant: 'outline',
    size: 'md',
    rounded: 'md',
    disabled: false,
  },
} satisfies Meta<VInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      return { args };
    },
    template: `<VInput v-bind="args" />`,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VInput variant="outline" placeholder="Outline variant..." />
          <VInput variant="success" placeholder="Success variant..." />
          <VInput variant="warning" placeholder="Warning variant..." />
          <VInput variant="danger" placeholder="Danger variant..." />
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VInput size="xs" placeholder="Extra small (xs)" />
          <VInput size="sm" placeholder="Small (sm)" />
          <VInput size="md" placeholder="Medium (md)" />
          <VInput size="lg" placeholder="Large (lg)" />
          <VInput size="xl" placeholder="Extra large (xl)" />
          <VInput size="2xl" placeholder="2X large (2xl)" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const RoundedStyles: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VInput rounded="none" placeholder="Rounded none" />
          <VInput rounded="sm" placeholder="Rounded sm" />
          <VInput rounded="md" placeholder="Rounded md" />
          <VInput rounded="lg" placeholder="Rounded lg" />
          <VInput rounded="full" placeholder="Rounded full (Search style)" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VInput modelValue="Pre-filled value" placeholder="Normal state" />
          <VInput disabled placeholder="Disabled state..." />
        </VCluster>
      </VBox>
    `,
  }),
};
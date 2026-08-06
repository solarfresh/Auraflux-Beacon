import VButton, {type VButtonProps} from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Buttons/VButton',
  component: VButton,
  tags: ['autodocs'],
  args: {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    iconOnly: false,
  },
} satisfies Meta<VButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VButton },
    setup() {
      return { args };
    },
    template: `<VButton v-bind="args">{{ args.default }}</VButton>`,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" wrap=true>
          <VButton variant="primary">Primary</VButton>
          <VButton variant="secondary">Secondary</VButton>
          <VButton variant="tertiary">Tertiary</VButton>
          <VButton variant="outline">Outline</VButton>
          <VButton variant="danger">Danger</VButton>
          <VButton variant="ghost">Ghost</VButton>
          <VButton variant="success">Success</VButton>
          <VButton variant="warning">Warning</VButton>
          <VButton variant="info">Info</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton size="xs">xs</VButton>
          <VButton size="sm">sm</VButton>
          <VButton size="md">md</VButton>
          <VButton size="lg">lg</VButton>
          <VButton size="xl">xl</VButton>
          <VButton size="2xl">2xl</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton iconName="Plus" variant="primary">Add Item</VButton>
          <VButton iconName="Trash" variant="danger">Delete</VButton>
          <VButton iconName="ArrowPath" iconOnly aria-label="Refresh" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton loading>Loading...</VButton>
          <VButton disabled>Disabled</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};
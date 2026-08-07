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
    theme: 'primary',
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

export const Theme: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" wrap=true>
          <VButton theme="primary">Primary</VButton>
          <VButton theme="secondary">Secondary</VButton>
          <VButton theme="tertiary">Tertiary</VButton>
          <VButton theme="outline">Outline</VButton>
          <VButton theme="danger">Danger</VButton>
          <VButton theme="ghost">Ghost</VButton>
          <VButton theme="success">Success</VButton>
          <VButton theme="warning">Warning</VButton>
          <VButton theme="info">Info</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
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
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton iconName="Plus" theme="primary">Add Item</VButton>
          <VButton iconName="Trash" theme="danger">Delete</VButton>
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
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton loading>Loading...</VButton>
          <VButton disabled>Disabled</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};
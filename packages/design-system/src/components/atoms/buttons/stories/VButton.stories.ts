import VButton, { type VButtonProps } from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Buttons/VButton',
  component: VButton,
  tags: ['autodocs'],
  args: {
    type: 'button',
    attention: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    iconOnly: false,
  },
  argTypes: {
    attention: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    surface: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
} satisfies Meta<VButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    default: 'Button',
  },
  render: (args) => ({
    components: { VButton },
    setup() {
      return { args };
    },
    template: `<VButton v-bind="args">{{ args.default }}</VButton>`,
  }),
};

/** Attention Levels (Primary / Secondary / Tertiary) */
export const Attention: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton attention="primary">Primary Action</VButton>
          <VButton attention="secondary">Secondary Action</VButton>
          <VButton attention="tertiary">Tertiary Action</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Intent Matrix (Semantic Colors) */
export const Intent: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VButton intent="brand">Brand</VButton>
          <VButton intent="neutral">Neutral</VButton>
          <VButton intent="success">Success</VButton>
          <VButton intent="warning">Warning</VButton>
          <VButton intent="danger">Danger</VButton>
          <VButton intent="info">Info</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Surface Variants Matrix */
export const Surface: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VButton surface="solid" intent="brand">Solid</VButton>
          <VButton surface="soft" intent="brand">Soft</VButton>
          <VButton surface="outline" intent="brand">Outline</VButton>
          <VButton surface="ghost" intent="brand">Ghost</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
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
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton iconName="Plus" attention="primary">Add Item</VButton>
          <VButton iconName="Trash" intent="danger">Delete</VButton>
          <VButton iconName="ArrowPath" iconOnly attention="tertiary" aria-label="Refresh" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VButton, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VButton loading>Loading...</VButton>
          <VButton disabled>Disabled</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import VBadge, { type VBadgeProps } from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Indicators/VBadge',
  component: VBadge,
  tags: ['autodocs'],
  args: {
    attention: 'tertiary',
    size: 'sm',
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
} satisfies Meta<VBadgeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VBadge },
    setup() {
      return { args };
    },
    template: `<VBadge v-bind="args">Default</VBadge>`,
  }),
};

/** Attention Levels (Primary / Secondary / Tertiary) */
export const Attention: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge attention="primary">Primary</VBadge>
          <VBadge attention="secondary">Secondary</VBadge>
          <VBadge attention="tertiary">Tertiary</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Intent Matrix (Semantic Status Colors) */
export const Intent: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VBadge intent="neutral">Neutral</VBadge>
          <VBadge intent="brand">Brand</VBadge>
          <VBadge intent="success">Success</VBadge>
          <VBadge intent="warning">Warning</VBadge>
          <VBadge intent="danger">Danger</VBadge>
          <VBadge intent="info">Info</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const Surface: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VBadge surface="solid" intent="brand">Solid</VBadge>
          <VBadge surface="soft" intent="brand">Soft</VBadge>
          <VBadge surface="outline" intent="brand">Outline</VBadge>
          <VBadge surface="ghost" intent="brand">Ghost</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VBadge size="xs">xs</VBadge>
          <VBadge size="sm">sm</VBadge>
          <VBadge size="md">md</VBadge>
          <VBadge size="lg">lg</VBadge>
          <VBadge size="xl">xl</VBadge>
          <VBadge size="2xl">2xl</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const UseCases: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VBadge intent="success" surface="soft" size="sm">v1.2.0 (Stable)</VBadge>
          <VBadge intent="warning" surface="soft" size="sm">In Progress</VBadge>
          <VBadge intent="danger" surface="soft" size="sm">Failed</VBadge>
          <VBadge attention="tertiary" size="xs">12</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};
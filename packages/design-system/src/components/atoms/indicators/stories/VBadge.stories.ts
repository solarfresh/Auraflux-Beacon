import type { Meta, StoryObj } from '@storybook/vue3';
import VBadge, {type VBadgeProps} from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Indicators/VBadge',
  component: VBadge,
  tags: ['autodocs'],
  args: {
    variant: 'secondary',
    size: 'sm',
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

export const Variants: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge variant="primary">Primary</VBadge>
          <VBadge variant="secondary">Secondary</VBadge>
          <VBadge variant="tertiary">Tertiary</VBadge>
          <VBadge variant="danger">Danger</VBadge>
          <VBadge variant="outline">Outline</VBadge>
          <VBadge variant="ghost">Ghost</VBadge>
          <VBadge variant="success">Success</VBadge>
          <VBadge variant="warning">Warning</VBadge>
          <VBadge variant="info">Info</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge size="xs" variant="secondary">xs</VBadge>
          <VBadge size="sm" variant="secondary">sm</VBadge>
          <VBadge size="md" variant="secondary">md</VBadge>
          <VBadge size="lg" variant="secondary">lg</VBadge>
          <VBadge size="xl" variant="secondary">xl</VBadge>
          <VBadge size="2xl" variant="secondary">2xl</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const UseCases: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox surface="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge variant="success" size="sm">v1.2.0 (Stable)</VBadge>
          <VBadge variant="warning" size="sm">In Progress</VBadge>
          <VBadge variant="danger" size="sm">Failed</VBadge>
          <VBadge variant="secondary" size="xs">12</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};
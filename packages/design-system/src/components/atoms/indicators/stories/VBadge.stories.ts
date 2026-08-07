import type { Meta, StoryObj } from '@storybook/vue3';
import VBadge, {type VBadgeProps} from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Indicators/VBadge',
  component: VBadge,
  tags: ['autodocs'],
  args: {
    theme: 'secondary',
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

export const Theme: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge theme="primary">Primary</VBadge>
          <VBadge theme="secondary">Secondary</VBadge>
          <VBadge theme="tertiary">Tertiary</VBadge>
          <VBadge theme="danger">Danger</VBadge>
          <VBadge theme="outline">Outline</VBadge>
          <VBadge theme="ghost">Ghost</VBadge>
          <VBadge theme="success">Success</VBadge>
          <VBadge theme="warning">Warning</VBadge>
          <VBadge theme="info">Info</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge size="xs" theme="secondary">xs</VBadge>
          <VBadge size="sm" theme="secondary">sm</VBadge>
          <VBadge size="md" theme="secondary">md</VBadge>
          <VBadge size="lg" theme="secondary">lg</VBadge>
          <VBadge size="xl" theme="secondary">xl</VBadge>
          <VBadge size="2xl" theme="secondary">2xl</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};

export const UseCases: Story = {
  render: () => ({
    components: { VBadge, VBox, VCluster },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VBadge theme="success" size="sm">v1.2.0 (Stable)</VBadge>
          <VBadge theme="warning" size="sm">In Progress</VBadge>
          <VBadge theme="danger" size="sm">Failed</VBadge>
          <VBadge theme="secondary" size="xs">12</VBadge>
        </VCluster>
      </VBox>
    `,
  }),
};
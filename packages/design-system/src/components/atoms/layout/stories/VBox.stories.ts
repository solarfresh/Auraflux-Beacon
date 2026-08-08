import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VBox, { type VBoxProps } from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

/**
 * `VBox` is the core skin/theme container for the Design System.
 * Strictly adheres to Design Tokens to manage padding, border, background, and interactive surfaces.
 */
const meta = {
  title: 'Atoms/Layout/VBox',
  component: VBox,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    padding: 'md',
    border: 'all',
    rounded: 'md',
    attention: 'secondary',
    inline: false,
    clickable: false,
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
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    border: {
      control: 'select',
      options: ['none', 'all', 'top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<VBoxProps>;

export default meta;
type Story = StoryObj<VBoxProps>;

// -----------------------------------------------------------------------------
// 1. Basic Scenario (Default)
// -----------------------------------------------------------------------------
export const Default: Story = {
  render: (args) => ({
    components: { VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args">
        <VTypography size="md" class="font-mono">Card container using default tokens.</VTypography>
      </VBox>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 2. Attention Hierarchy
// -----------------------------------------------------------------------------
export const AttentionHierarchy: Story = {
  render: () => ({
    components: { VBox, VCluster, VTypography },
    template: `
      <VCluster align="center" gap="md" :wrap="true">
        <VBox attention="primary" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Primary Attention</VTypography>
        </VBox>
        <VBox attention="secondary" border="all" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Secondary Attention</VTypography>
        </VBox>
        <VBox attention="tertiary" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Tertiary Attention</VTypography>
        </VBox>
      </VCluster>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 3. Intent Matrix (Semantic Colors)
// -----------------------------------------------------------------------------
export const IntentMatrix: Story = {
  render: () => ({
    components: { VBox, VCluster, VTypography },
    template: `
      <VCluster align="center" gap="md" :wrap="true">
        <VBox intent="brand" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Brand Intent</VTypography>
        </VBox>
        <VBox intent="neutral" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Neutral Intent</VTypography>
        </VBox>
        <VBox intent="success" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Success Intent</VTypography>
        </VBox>
        <VBox intent="warning" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Warning Intent</VTypography>
        </VBox>
        <VBox intent="danger" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Danger Intent</VTypography>
        </VBox>
        <VBox intent="info" surface="soft" padding="md" rounded="md">
          <VTypography size="sm" class="font-mono">Info Intent</VTypography>
        </VBox>
      </VCluster>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 4. Clickable Interactive Container
// -----------------------------------------------------------------------------
export const ClickableState: Story = {
  render: () => ({
    components: { VBox, VCluster, VTypography },
    template: `
      <VCluster align="center" gap="md" :wrap="true">
        <VBox clickable attention="secondary" border="all" padding="md" rounded="lg">
          <VTypography size="sm" class="font-mono">Clickable Card (Hover / Active / Focus)</VTypography>
        </VBox>
        <VBox clickable intent="brand" surface="soft" padding="md" rounded="lg">
          <VTypography size="sm" class="font-mono">Clickable Soft Card</VTypography>
        </VBox>
      </VCluster>
    `,
  }),
};
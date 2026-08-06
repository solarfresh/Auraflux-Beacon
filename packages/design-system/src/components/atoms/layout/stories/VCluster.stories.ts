import type { Meta, StoryObj } from '@storybook/vue3';
import VCluster, {type VClusterProps} from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Atoms/Layout/VCluster',
  component: VCluster,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: false,
    inline: false,
    fullWidth: false,
  },
} satisfies Meta<VClusterProps>;

export default meta;
type Story = StoryObj<typeof VCluster>;

/**
 * Default usage: Horizontal alignment with center item distribution.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VCluster, VButton },
    setup() {
      return { args };
    },
    template: `
      <VCluster v-bind="args">
        <VButton variant="primary">Proceed</VButton>
        <VButton variant="outline">Save Draft</VButton>
        <VButton variant="ghost">Cancel</VButton>
      </VCluster>
    `,
  }),
};

/**
 * Wrapped layout: Suitable for tag clouds or dense action buttons.
 */
export const Wrapped: Story = {
  args: {
    wrap: true,
    gap: 'sm',
  },
  render: (args) => ({
    components: { VCluster, VBox, VButton },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="md" border="all" rounded="md" class="max-w-xs">
        <VCluster v-bind="args">
          <VButton variant="secondary" size="xs">AI Logic</VButton>
          <VButton variant="secondary" size="xs">Sandbox</VButton>
          <VButton variant="secondary" size="xs">Fine-tune</VButton>
          <VButton variant="secondary" size="xs">System 2</VButton>
          <VButton variant="secondary" size="xs">Prompt Rules</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Space Between layout: Common pattern for headers, card titles, and toolbars.
 */
export const SpaceBetween: Story = {
  args: {
    justify: 'between',
    fullWidth: true,
  },
  render: (args) => ({
    components: { VCluster, VBox, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="md" surface="subtle" rounded="lg">
        <VCluster v-bind="args">
          <VTypography tag="h3" weight="bold" size="md">
            AI Parameter Settings
          </VTypography>
          <VCluster gap="sm">
            <VButton variant="outline" size="sm">Reset</VButton>
            <VButton variant="primary" size="sm">Save Changes</VButton>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Baseline Alignment: Maintains optical balance when child typography sizes vary.
 */
export const BaselineAlignment: Story = {
  args: {
    align: 'baseline',
    gap: 'sm',
  },
  render: (args) => ({
    components: { VCluster, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VCluster v-bind="args">
        <VTypography tag="span" size="2xl" weight="bold">
          NT$ 12,800
        </VTypography>
        <VTypography tag="span" size="xs" variant="tertiary">
          / month (tax incl.)
        </VTypography>
      </VCluster>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import VGrid, { type VGridProps } from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Atoms/Layout/VGrid',
  component: VGrid,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    padding: 'none',
    cols: 1,
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
} satisfies Meta<VGridProps>;

export default meta;
type Story = StoryObj<typeof VGrid>;

/**
 * Default usage: A simple 1-column layout or baseline grid structure.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VGrid, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VGrid v-bind="args">
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography>Grid Item 1</VTypography>
        </VBox>
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography>Grid Item 2</VTypography>
        </VBox>
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography>Grid Item 3</VTypography>
        </VBox>
      </VGrid>
    `,
  }),
};

/**
 * Multi-column Layout: Suitable for dashboards, card lists, or structured data displays.
 */
export const MultiColumn: Story = {
  args: {
    cols: 3,
    gap: 'lg',
  },
  render: (args) => ({
    components: { VGrid, VBox, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VGrid v-bind="args">
        <VBox padding="md" border="all" rounded="lg" gap="sm">
          <VTypography tag="h4" weight="bold">Overview</VTypography>
          <VTypography size="sm" variant="tertiary">Monitor primary system operations and metrics.</VTypography>
          <VButton variant="outline" size="sm">Configure</VButton>
        </VBox>
        <VBox padding="md" border="all" rounded="lg" gap="sm">
          <VTypography tag="h4" weight="bold">Analytics</VTypography>
          <VTypography size="sm" variant="tertiary">Inspect traffic patterns and conversion trends.</VTypography>
          <VButton variant="outline" size="sm">View Data</VButton>
        </VBox>
        <VBox padding="md" border="all" rounded="lg" gap="sm">
          <VTypography tag="h4" weight="bold">Security</VTypography>
          <VTypography size="sm" variant="tertiary">Review permission policies and audit logs.</VTypography>
          <VButton variant="outline" size="sm">Manage</VButton>
        </VBox>
      </VGrid>
    `,
  }),
};

/**
 * Responsive Columns: Adapts column count dynamically based on screen breakpoints (e.g., 1 col on mobile, 3 cols on large screens).
 */
export class ResponsiveColumns {
  // TypeScript representation or standard story object format
}

export const Responsive: Story = {
  args: {
    cols: '1 md:2 lg:3',
    gap: 'md',
    padding: 'md',
  },
  render: (args) => ({
    components: { VGrid, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox surface="subtle" rounded="lg">
        <VGrid v-bind="args">
          <VBox padding="md" surface="default" rounded="md">
            <VTypography weight="bold">Card One</VTypography>
            <VTypography size="xs" variant="tertiary">Responsive scaling item</VTypography>
          </VBox>
          <VBox padding="md" surface="default" rounded="md">
            <VTypography weight="bold">Card Two</VTypography>
            <VTypography size="xs" variant="tertiary">Responsive scaling item</VTypography>
          </VBox>
          <VBox padding="md" surface="default" rounded="md">
            <VTypography weight="bold">Card Three</VTypography>
            <VTypography size="xs" variant="tertiary">Responsive scaling item</VTypography>
          </VBox>
        </VGrid>
      </VBox>
    `,
  }),
};

/**
 * Custom Padding and Gaps: Demonstrates spatial adjustments using theme tokens.
 */
export const CustomSpacing: Story = {
  args: {
    cols: 2,
    gap: 'xl',
    padding: 'lg',
  },
  render: (args) => ({
    components: { VGrid, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox border="all" rounded="lg">
        <VGrid v-bind="args">
          <VBox padding="md" surface="subtle" rounded="md">
            <VTypography weight="bold">Padded Section A</VTypography>
          </VBox>
          <VBox padding="md" surface="subtle" rounded="md">
            <VTypography weight="bold">Padded Section B</VTypography>
          </VBox>
        </VGrid>
      </VBox>
    `,
  }),
};
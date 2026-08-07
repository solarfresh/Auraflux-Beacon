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
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
} satisfies Meta<VGridProps>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        <VBox padding="md" attention="tertiary" border="all" rounded="md">
          <VTypography>Grid Item 1</VTypography>
        </VBox>
        <VBox padding="md" attention="tertiary" border="all" rounded="md">
          <VTypography>Grid Item 2</VTypography>
        </VBox>
        <VBox padding="md" attention="tertiary" border="all" rounded="md">
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
        <VBox padding="md" border="all" rounded="lg">
          <VTypography tag="h4" weight="bold">Overview</VTypography>
          <VTypography size="sm" intent="neutral" class="mt-1 mb-4">Monitor primary system operations and metrics.</VTypography>
          <VButton attention="secondary" size="sm">Configure</VButton>
        </VBox>
        <VBox padding="md" border="all" rounded="lg">
          <VTypography tag="h4" weight="bold">Analytics</VTypography>
          <VTypography size="sm" intent="neutral" class="mt-1 mb-4">Inspect traffic patterns and conversion trends.</VTypography>
          <VButton attention="secondary" size="sm">View Data</VButton>
        </VBox>
        <VBox padding="md" border="all" rounded="lg">
          <VTypography tag="h4" weight="bold">Security</VTypography>
          <VTypography size="sm" intent="neutral" class="mt-1 mb-4">Review permission policies and audit logs.</VTypography>
          <VButton attention="secondary" size="sm">Manage</VButton>
        </VBox>
      </VGrid>
    `,
  }),
};

/**
 * Responsive Columns: Adapts column count dynamically based on screen breakpoints (e.g., 1 col on mobile, 3 cols on large screens).
 */
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
      <VBox attention="secondary" border="all" rounded="lg">
        <VGrid v-bind="args">
          <VBox padding="md" attention="primary" border="all" rounded="md">
            <VTypography weight="bold">Card One</VTypography>
            <VTypography size="xs" class="opacity-80">Responsive scaling item</VTypography>
          </VBox>
          <VBox padding="md" attention="primary" border="all" rounded="md">
            <VTypography weight="bold">Card Two</VTypography>
            <VTypography size="xs" class="opacity-80">Responsive scaling item</VTypography>
          </VBox>
          <VBox padding="md" attention="primary" border="all" rounded="md">
            <VTypography weight="bold">Card Three</VTypography>
            <VTypography size="xs" class="opacity-80">Responsive scaling item</VTypography>
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
          <VBox padding="md" attention="tertiary" border="all" rounded="md">
            <VTypography weight="bold">Padded Section A</VTypography>
          </VBox>
          <VBox padding="md" attention="tertiary" border="all" rounded="md">
            <VTypography weight="bold">Padded Section B</VTypography>
          </VBox>
        </VGrid>
      </VBox>
    `,
  }),
};
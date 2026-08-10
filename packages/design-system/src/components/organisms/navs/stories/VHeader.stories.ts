import type { Meta, StoryObj } from '@storybook/vue3';
import VHeader, { type VHeaderProps } from '@auraflux/design-system/components/organisms/navs/VHeader.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Organisms/Navs/VHeader',
  component: VHeader,
  tags: ['autodocs'],
  args: {
    intent: 'brand',
    surface: 'solid',
    showBack: false,
    title: 'AuraFlux',
    section: 'Workspace',
  },
  argTypes: {
    intent: { control: 'select', options: ['brand', 'neutral', 'accent'] },
    surface: { control: 'select', options: ['solid', 'base', 'subtle'] },
    showBack: { control: 'boolean' },
    title: { control: 'text' },
    section: { control: 'text' },
  },
} satisfies Meta<VHeaderProps>;

export default meta;
type Story = StoryObj<typeof VHeader>;

/**
 * Default usage: Standard application header with default identity props and slots.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VHeader, VButton, VCluster, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VHeader v-bind="args">
        <template #center>
          <VTypography>Global Search / Navigation Placeholder</VTypography>
        </template>
        <template #actions>
          <VCluster gap="sm">
            <VButton attention="primary" border="none" size="sm" icon-name="Bell" icon-only />
            <VButton attention="primary" border="none" size="sm" icon-name="User" icon-only />
          </VCluster>
        </template>
      </VHeader>
    `,
  }),
};

/**
 * Header with Back Navigation: Displays a back button alongside the identity section.
 */
export const WithBackButton: Story = {
  args: {
    showBack: true,
    title: 'Project Alpha',
    section: 'Consultation',
  },
  render: (args) => ({
    components: { VHeader, VButton, VCluster },
    setup() {
      return { args };
    },
    template: `
      <VHeader v-bind="args">
        <template #actions>
          <VCluster gap="sm">
            <VButton attention="primary" border="none" size="sm" icon-name="Cog6Tooth" icon-only />
          </VCluster>
        </template>
      </VHeader>
    `,
  }),
};

/**
 * Custom Surface & Intent: Demonstrates the header under neutral theme intent and subtle surface.
 */
export const CustomTheme: Story = {
  args: {
    intent: 'neutral',
    surface: 'solid',
    title: 'Dashboard',
    section: 'Analytics',
  },
  render: (args) => ({
    components: { VHeader, VButton },
    setup() {
      return { args };
    },
    template: `
      <VHeader v-bind="args">
        <template #actions>
          <VButton intent="neutral" surface="solid" border="none" size="sm">Export Report</VButton>
        </template>
      </VHeader>
    `,
  }),
};
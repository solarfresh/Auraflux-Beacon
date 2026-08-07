import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VDivider, { type VDividerProps } from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

/**
 * `VDivider` is a pure Atom indicator component that renders a lightweight,
 * zero-dependency semantic divider line for separating layout content or control groups.
 * It automatically inherits the parent container's text color (`bg-current`).
 */
const meta = {
  title: 'Atoms/Layout/VDivider',
  component: VDivider,
  tags: ['autodocs'],
  args: {
    orientation: 'vertical',
    size: 'sm',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
} satisfies Meta<VDividerProps>;

export default meta;
type Story = StoryObj<typeof VDivider>;

/**
 * Default vertical divider inside a toolbar-like button group.
 */
export const DefaultVertical: Story = {
  render: (args) => ({
    components: { VDivider, VButton, VBox, VCluster },
    setup() {
      return { args };
    },
    template: `
      <VBox border="all" padding="md" rounded="lg" class="w-fit text-slate-800">
        <VCluster align="center" gap="sm">
          <VButton attention="tertiary" size="sm">Edit</VButton>
          <VButton attention="tertiary" size="sm">Duplicate</VButton>
          <VDivider v-bind="args" />
          <VButton intent="danger" surface="ghost" size="sm">Delete</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Showcase of all vertical divider sizes (`sm`, `md`, `lg`, `xl`, `full`).
 */
export const VerticalSizes: Story = {
  render: () => ({
    components: { VDivider, VTypography, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="text-slate-800">
        <VCluster align="center" gap="lg" :wrap="true">
          <VCluster align="center" gap="xs">
            <VTypography size="xs" intent="neutral" class="font-mono">sm</VTypography>
            <VDivider orientation="vertical" size="sm" />
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography size="xs" intent="neutral" class="font-mono">md</VTypography>
            <VDivider orientation="vertical" size="md" />
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography size="xs" intent="neutral" class="font-mono">lg</VTypography>
            <VDivider orientation="vertical" size="lg" />
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography size="xs" intent="neutral" class="font-mono">xl</VTypography>
            <VDivider orientation="vertical" size="xl" />
          </VCluster>

          <VCluster align="center" gap="xs" class="h-16">
            <VTypography size="xs" intent="neutral" class="font-mono">full (parent h-16)</VTypography>
            <VDivider orientation="vertical" size="full" />
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Horizontal divider used inside a Card container.
 */
export const Horizontal: Story = {
  render: (args) => ({
    components: { VDivider, VTypography, VButton, VBox, VStack },
    setup() {
      return { args };
    },
    template: `
      <VBox border="all" padding="md" rounded="xl" class="w-80 shadow-sm text-slate-800">
        <VStack gap="xs">
          <VTypography tag="h3" size="base" weight="semibold">Account Settings</VTypography>
          <VTypography tag="p" size="xs" intent="neutral">Manage your profile and security settings.</VTypography>

          <VDivider v-bind="args" class="my-2" />

          <VStack gap="xs">
            <VButton attention="tertiary" size="sm" class="w-full justify-start">Profile Overview</VButton>
            <VButton attention="tertiary" size="sm" class="w-full justify-start">API Tokens</VButton>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
  args: {
    orientation: 'horizontal',
    size: 'full',
  },
};
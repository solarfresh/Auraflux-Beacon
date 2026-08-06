import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

type VDividerProps = InstanceType<typeof VDivider>['$props'];

/**
 * `VDivider` is a pure Atom indicator component that renders a lightweight,
 * zero-dependency semantic divider line for separating layout content or control groups.
 */
const meta = {
  title: 'Atoms/Layout/VDivider',
  component: VDivider,
  tags: ['autodocs'],
  args: {
    orientation: 'vertical',
    size: 'sm',
  },
} satisfies Meta<VDividerProps>;

export default meta;
type Story = StoryObj<typeof VDivider>;

/**
 * Default vertical divider inside a toolbar-like button group using VBox & VCluster.
 */
export const DefaultVertical: Story = {
  render: (args) => ({
    components: { VDivider, VButton, VBox, VCluster },
    setup() {
      return { args };
    },
    template: `
      <VBox background="white" border="all" padding="md" rounded="lg" class="w-fit">
        <VCluster align="center" gap="sm">
          <VButton variant="ghost" size="sm">Edit</VButton>
          <VButton variant="ghost" size="sm">Duplicate</VButton>
          <VDivider v-bind="args" />
          <VButton variant="ghost" size="sm" class="text-rose-600 hover:text-rose-700">Delete</VButton>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Showcase of all vertical divider sizes (`sm`, `md`, `lg`, `full`) using VBox & VCluster.
 */
export const VerticalSizes: Story = {
  render: () => ({
    components: { VDivider, VTypography, VBox, VCluster },
    template: `
      <VBox background="white" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg">
          <VCluster align="center" gap="xs">
            <VTypography size="xs" variant="outline" class="font-mono">sm (h-4)</VTypography>
            <VDivider orientation="vertical" size="sm" />
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography size="xs" variant="outline" class="font-mono">md (h-6)</VTypography>
            <VDivider orientation="vertical" size="md" />
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography size="xs" variant="outline" class="font-mono">lg (h-8)</VTypography>
            <VDivider orientation="vertical" size="lg" />
          </VCluster>

          <VCluster align="center" gap="xs" class="h-12">
            <VTypography size="xs" variant="outline" class="font-mono">full (h-full)</VTypography>
            <VDivider orientation="vertical" size="full" />
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Horizontal divider used inside a Card container using VBox & VStack.
 */
export const Horizontal: Story = {
  render: (args) => ({
    components: { VDivider, VTypography, VButton, VBox, VStack },
    setup() {
      return { args };
    },
    template: `
      <VBox background="white" border="all" padding="md" rounded="xl" class="w-80 shadow-sm">
        <VStack gap="xs">
          <VTypography tag="h3" size="base" weight="semibold" variant="outline">Account Settings</VTypography>
          <VTypography tag="p" size="xs" variant="ghost">Manage your profile and security settings.</VTypography>

          <VDivider v-bind="args" />

          <VStack gap="xs">
            <VButton variant="ghost" size="sm" class="w-full justify-start variant="outline">Profile Overview</VButton>
            <VButton variant="ghost" size="sm" class="w-full justify-start variant="outline">API Tokens</VButton>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
  args: {
    orientation: 'horizontal',
    size: 'md',
  },
};
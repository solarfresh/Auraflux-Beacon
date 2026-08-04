import type { Meta, StoryObj } from '@storybook/vue3';
import VIcon, { type VIconProps } from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Atoms/Indicators/VIcon',
  component: VIcon,
  tags: ['autodocs'],
  args: {
    name: 'CheckCircle',
    type: 'solid',
    size: 'md',
    color: 'text-indigo-600',
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    color: {
      control: 'text',
    },
  },
} satisfies Meta<VIconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VIcon },
    setup() {
      return { args };
    },
    template: `<VIcon v-bind="args" />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox background="white" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg">
          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xs" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">xs (w-3 h-3)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="sm" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">sm (w-4 h-4)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">md (w-6 h-6)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="lg" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">lg (w-8 h-8)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xl" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">xl (w-10 h-10)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="2xl" color="text-amber-500" />
            <VTypography size="xs" color="slate-400" class="font-mono">2xl (w-12 h-12)</VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};

export const StyleVariants: Story = {
  render: () => ({
    components: { VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox background="white" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="xl">
          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="solid" size="lg" color="text-rose-500" />
            <VTypography size="sm" color="slate-700">Solid</VTypography>
          </VCluster>

          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="outline" size="lg" color="text-rose-500" />
            <VTypography size="sm" color="slate-700">Outline</VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};
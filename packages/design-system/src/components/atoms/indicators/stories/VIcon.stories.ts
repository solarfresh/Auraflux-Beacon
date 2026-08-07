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
    theme: 'secondary',
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

export const Theme: Story = {
  render: () => ({
    components: { VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg" wrap=true>
          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="primary" />
            <VTypography size="xs" theme="primary" class="font-mono">Primary</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">Secondary</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="tertiary" />
            <VTypography size="xs" theme="tertiary" class="font-mono">Tertiary</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="danger" />
            <VTypography size="xs" theme="danger" class="font-mono">Danger</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="outline" />
            <VTypography size="xs" theme="outline" class="font-mono">Outline</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="ghost" />
            <VTypography size="xs" theme="ghost" class="font-mono">Ghost</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="success" />
            <VTypography size="xs" theme="success" class="font-mono">Success</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="warning" />
            <VTypography size="xs" theme="warning" class="font-mono">Warning</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="info" />
            <VTypography size="xs" theme="info" class="font-mono">Info</VTypography>
          </VCluster>

        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg">
          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xs" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">xs (w-3 h-3)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="sm" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">sm (w-4 h-4)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">md (w-6 h-6)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="lg" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">lg (w-8 h-8)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xl" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">xl (w-10 h-10)</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="2xl" theme="secondary" />
            <VTypography size="xs" theme="secondary" class="font-mono">2xl (w-12 h-12)</VTypography>
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
      <VBox theme="base" border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="xl">
          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="solid" size="lg" theme="secondary" />
            <VTypography size="sm" theme="secondary">Solid</VTypography>
          </VCluster>

          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="outline" size="lg" theme="secondary" />
            <VTypography size="sm" theme="secondary">Outline</VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};
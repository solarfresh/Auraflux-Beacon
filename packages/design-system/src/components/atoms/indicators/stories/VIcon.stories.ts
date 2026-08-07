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
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['solid', 'outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
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

/**
 * Icons inherit text color from parent elements (via CSS `currentColor`).
 * You can combine them with VTypography or intent classes.
 */
export const ColorInheritance: Story = {
  render: () => ({
    components: { VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg" :wrap="true">
          <VCluster align="center" gap="xs">
            <VTypography intent="brand" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Brand
            </VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography intent="neutral" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Neutral
            </VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography intent="success" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Success
            </VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography intent="warning" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Warning
            </VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography intent="danger" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Danger
            </VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VTypography intent="info" class="inline-flex items-center gap-1 font-mono" size="xs">
              <VIcon name="Star" size="md" />
              Info
            </VTypography>
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
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="lg" :wrap="true">
          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xs" />
            <VTypography size="xs" class="font-mono">xs</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="sm" />
            <VTypography size="xs" class="font-mono">sm</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="md" />
            <VTypography size="xs" class="font-mono">md</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="lg" />
            <VTypography size="xs" class="font-mono">lg</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="xl" />
            <VTypography size="xs" class="font-mono">xl</VTypography>
          </VCluster>

          <VCluster align="center" gap="xs">
            <VIcon name="Star" size="2xl" />
            <VTypography size="xs" class="font-mono">2xl</VTypography>
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
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="xl">
          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="solid" size="lg" />
            <VTypography size="sm">Solid</VTypography>
          </VCluster>

          <VCluster align="center" gap="sm">
            <VIcon name="Heart" type="outline" size="lg" />
            <VTypography size="sm">Outline</VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTooltip, { type VTooltipProps } from '@auraflux/design-system/components/molecules/indicators/VTooltip.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Molecules/Indicators/VTooltip',
  component: VTooltip,
  tags: ['autodocs'],
  args: {
    content: 'Calculated using Reciprocal Rank Fusion across retrieval scores.',
    position: 'top-center',
    intent: 'neutral',
    surface: 'solid',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top-center', 'bottom-center', 'bottom-right', 'left-center'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    surface: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'subtle'],
    },
    content: {
      control: 'text',
    },
  },
} satisfies Meta<VTooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic Icon Trigger Variant
 */
export const Default: Story = {
  render: (args) => ({
    components: { VTooltip, VIcon, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="xl" class="flex items-center justify-center min-h-[160px]">
        <VTooltip v-bind="args">
          <VIcon
            name="QuestionMarkCircle"
            size="sm"
            class="text-slate-400 hover:text-slate-600 cursor-help"
          />
        </VTooltip>
      </VBox>
    `,
  }),
};

/**
 * Alignment Anchor Positions Matrix
 */
export const Positions: Story = {
  render: () => ({
    components: { VTooltip, VButton, VBox, VCluster },
    template: `
      <VBox padding="xl" class="flex items-center justify-center min-h-[300px]">
        <VCluster gap="lg" align="center" justify="center">
          <VTooltip content="Top Center Alignment" position="top-center">
            <VButton size="sm" attention="secondary">Top Center</VButton>
          </VTooltip>

          <VTooltip content="Bottom Center Alignment" position="bottom-center">
            <VButton size="sm" attention="secondary">Bottom Center</VButton>
          </VTooltip>

          <VTooltip content="Left Center Alignment" position="left-center">
            <VButton size="sm" attention="secondary">Left Center</VButton>
          </VTooltip>

          <VTooltip content="Bottom Right Alignment" position="bottom-right">
            <VButton size="sm" attention="secondary">Bottom Right</VButton>
          </VTooltip>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Color Intent Matrix Breakdown
 */
export const IntentVariations: Story = {
  render: () => ({
    components: { VTooltip, VIcon, VBox, VCluster, VTypography },
    template: `
      <VBox padding="xl" class="flex flex-col gap-8 min-h-[200px]">
        <VTypography size="xs" weight="semibold">Design Tokens Intent Matrix (Solid Surface)</VTypography>
        <VCluster gap="md" align="center">
          <VTooltip content="Neutral default status" intent="neutral" surface="solid">
            <VIcon name="InformationCircle" size="md" class="text-slate-500 cursor-pointer" />
          </VTooltip>

          <VTooltip content="Primary system action hint" intent="brand" surface="solid">
            <VIcon name="Sparkles" size="md" class="text-blue-500 cursor-pointer" />
          </VTooltip>

          <VTooltip content="Success validation hint" intent="success" surface="solid">
            <VIcon name="CheckCircle" size="md" class="text-emerald-500 cursor-pointer" />
          </VTooltip>

          <VTooltip content="Warning notice hint" intent="warning" surface="solid">
            <VIcon name="ExclamationTriangle" size="md" class="text-amber-500 cursor-pointer" />
          </VTooltip>

          <VTooltip content="Critical error alert details" intent="danger" surface="solid">
            <VIcon name="XCircle" size="md" class="text-rose-500 cursor-pointer" />
          </VTooltip>
        </VCluster>
      </VBox>
    `,
  }),
};
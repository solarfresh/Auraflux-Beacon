import VCode, { type VCodeProps } from '@auraflux/design-system/components/atoms/indicators/VCode.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Indicators/VCode',
  component: VCode,
  tags: ['autodocs'],
  args: {
    border: 'none',
    size: 'xs',
    weight: 'normal',
    attention: 'secondary',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    },
    attention: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    border: {
      control: 'select',
      options: ['none', 'all', 'top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<VCodeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    default: '{{ variable }}',
  },
  render: (args) => ({
    components: { VCode },
    setup() {
      return { args };
    },
    template: `<VCode v-bind="args">{{ args.default }}</VCode>`,
  }),
};

/** UI Mockup Specific Examples (Form Field Hint Integration) */
export const UIMockupExamples: Story = {
  render: () => ({
    components: { VCode, VBox, VCluster, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-md">
        <VCluster gap="xs" align="center">
          <VTypography size="xs" attention="secondary">
            Type
          </VTypography>
          <VCode size="xs">{{ '{{' }}</VCode>
          <VTypography size="xs" attention="secondary">
            to auto-complete variables
          </VTypography>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Semantic Intent Variants */
export const SemanticIntents: Story = {
  render: () => ({
    components: { VCode, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-md">
        <VStack gap="sm" align="start">
          <VCode intent="neutral">npm install @auraflux/design-system</VCode>
          <VCode intent="brand">const agent = new Agent();</VCode>
          <VCode intent="success">STATUS_OK_200</VCode>
          <VCode intent="warning">DEPRECATED_API_V1</VCode>
          <VCode intent="danger">ERR_CONNECTION_REFUSED</VCode>
          <VCode intent="info">v1.4.0-beta</VCode>
        </VStack>
      </VBox>
    `,
  }),
};

/** Typography Sizes */
export const Sizes: Story = {
  render: () => ({
    components: { VCode, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-md">
        <VStack gap="sm" align="start">
          <VCode size="xs">Extra Small (xs) - {{ input_text }}</VCode>
          <VCode size="sm">Small (sm) - {{ input_text }}</VCode>
          <VCode size="md">Medium (md) - {{ input_text }}</VCode>
          <VCode size="lg">Large (lg) - {{ input_text }}</VCode>
        </VStack>
      </VBox>
    `,
  }),
};
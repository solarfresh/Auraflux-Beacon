import VPre, { type VPreProps } from '@auraflux/design-system/components/atoms/indicators/VPre.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Indicators/VPre',
  component: VPre,
  tags: ['autodocs'],
  args: {
    border: 'all',
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
} satisfies Meta<VPreProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    default: '{\n  "agent": "Triple Extractor",\n  "status": "active"\n}',
  },
  render: (args) => ({
    components: { VPre },
    setup() {
      return { args };
    },
    template: `<VPre v-bind="args">{{ args.default }}</VPre>`,
  }),
};

/** UI Mockup Specific Examples (JSON Payload Preview) */
export const UIMockupExamples: Story = {
  render: () => ({
    components: { VPre, VBox, VStack, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="xs" align="start">
          <VTypography size="xs" attention="secondary" weight="semibold">
            Output Payload
          </VTypography>
          <VPre size="xs">{
  "triples": [
    ["Company", "Revenue", "$12.5M"]
  ]
}</VPre>
        </VStack>
      </VBox>
    `,
  }),
};

/** Semantic Intent Variants */
export const SemanticIntents: Story = {
  render: () => ({
    components: { VPre, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="sm" align="start">
          <VPre intent="neutral">// Neutral Log\nINFO: Service initialized</VPre>
          <VPre intent="brand">// Brand Config\nconst config = { mode: "active" };</VPre>
          <VPre intent="success">// Success Response\nHTTP/1.1 200 OK\nContent-Type: application/json</VPre>
          <VPre intent="warning">// Warning Trace\nWARN: High memory consumption</VPre>
          <VPre intent="danger">// Error Exception\nERR_CONNECTION_REFUSED at Port 8080</VPre>
          <VPre intent="info">// Build Info\nVersion: v1.4.0-beta\nCommit: 7a8f9b2</VPre>
        </VStack>
      </VBox>
    `,
  }),
};

/** Typography Sizes */
export const Sizes: Story = {
  render: () => ({
    components: { VPre, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="sm" align="start">
          <VPre size="xs">xs: { "key": "value" }</VPre>
          <VPre size="sm">sm: { "key": "value" }</VPre>
          <VPre size="md">md: { "key": "value" }</VPre>
          <VPre size="lg">lg: { "key": "value" }</VPre>
        </VStack>
      </VBox>
    `,
  }),
};
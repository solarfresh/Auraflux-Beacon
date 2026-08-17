import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VJsonViewer, { type VJsonViewerProps } from '@auraflux/design-system/components/molecules/indicators/VJsonViewer.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Molecules/Indicators/VJsonViewer',
  component: VJsonViewer,
  tags: ['autodocs'],
  args: {
    label: 'Output Response',
    isValidated: true,
    value: {
      agent: 'Triple Extractor',
      status: 'success',
      execution_time_ms: 1180,
      tokens_used: 148,
      results: [
        {
          entity: 'AuraFlux',
          category: 'Design System',
          active: true
        }
      ]
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Section label text displayed in the header'
    },
    isValidated: {
      control: 'boolean',
      description: 'Controls the visibility of the "Schema Validated" badge'
    },
    value: {
      control: 'object',
      description: 'JSON object or raw JSON string payload'
    }
  }
} satisfies Meta<VJsonViewerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VJsonViewer },
    setup() {
      return { args };
    },
    template: `<VJsonViewer v-bind="args" />`
  })
};

/** Playground Layout Integration (In-Context Panel Mockup) */
export const PlaygroundPanelContext: Story = {
  render: () => ({
    components: { VJsonViewer, VBox, VStack },
    setup() {
      const jsonPayload = {
        model: 'gpt-4o',
        temperature: 0.2,
        response: {
          intent: 'extract_entities',
          confidence: 0.98,
          entities: ['VCode', 'VPre', 'VJsonViewer']
        }
      };
      return { jsonPayload };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-lg bg-gray-900">
        <VStack gap="md">
          <VJsonViewer
            label="Live Output Response"
            :is-validated="true"
            :value="jsonPayload"
          />
        </VStack>
      </VBox>
    `
  })
};

/** Stringified JSON Input Variant */
export const StringifiedJsonInput: Story = {
  render: () => ({
    components: { VJsonViewer },
    setup() {
      const stringifiedValue = '{"status": 200, "message": "Successfully parsed stringified payload", "data": null}';
      return { stringifiedValue };
    },
    template: `
      <VJsonViewer
        label="Raw String Response"
        :is-validated="false"
        :value="stringifiedValue"
      />
    `
  })
};
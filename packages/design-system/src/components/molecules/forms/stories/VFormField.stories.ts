import type { Meta, StoryObj } from '@storybook/vue3';
import VFormField, {type VFormFieldProps} from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Molecules/Forms/VFormField',
  component: VFormField,
  tags: ['autodocs'],
  args: {
    label: 'Model Name',
    description: 'Enter a unique identifier for your AI decision model.',
    error: '',
    required: false,
    disabled: false,
  },
} satisfies Meta<VFormFieldProps>;

export default meta;
type Story = StoryObj<typeof VFormField>;

/**
 * Default usage: Standard form field with a text input slot.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VFormField, VBox, VInput },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-sm">
        <VFormField v-bind="args" v-slot="{ id, isDisabled }">
          <VInput :id="id" :disabled="isDisabled" placeholder="e.g. GPT-4o Strategy Agent" />
        </VFormField>
      </VBox>
    `,
  }),
};

/**
 * Required Field: Displays a red asterisk next to the label.
 */
export const Required: Story = {
  args: {
    label: 'API Key',
    description: 'Required for authenticating requests to the model provider.',
    required: true,
  },
  render: (args) => ({
    components: { VFormField, VBox, VInput },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-sm">
        <VFormField v-bind="args" v-slot="{ id, isDisabled }">
          <VInput :id="id" :disabled="isDisabled" type="password" placeholder="sk-..." />
        </VFormField>
      </VBox>
    `,
  }),
};

/**
 * Error State: Replaces the description with an animated error message.
 */
export const WithError: Story = {
  args: {
    label: 'Temperature Parameter',
    description: 'Controls randomness: 0 is deterministic, 1 is creative.',
    error: 'Value must be between 0.0 and 1.0',
    required: true,
  },
  render: (args) => ({
    components: { VFormField, VBox, VInput },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-sm">
        <VFormField v-bind="args" v-slot="{ id, isDisabled }">
          <VInput :id="id" :disabled="isDisabled" value="2.5" />
        </VFormField>
      </VBox>
    `,
  }),
};

/**
 * With Hint Slot: Renders additional interactive or contextual elements in the header row.
 */
export const WithHintSlot: Story = {
  args: {
    label: 'System Prompt',
    description: 'Define the core directives for the decision engine.',
  },
  render: (args) => ({
    components: { VFormField, VBox, VInput, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-sm">
        <VFormField v-bind="args">
          <template #hint>
            <VTypography tag="span" size="xs" variant="ghost" class="cursor-pointer hover:underline">
              View Examples
            </VTypography>
          </template>

          <template #default="{ id, isDisabled }">
            <VInput :id="id" :disabled="isDisabled" placeholder="You are an expert strategic planner..." />
          </template>
        </VFormField>
      </VBox>
    `,
  }),
};

/**
 * Disabled State: Propagates disabled status to the inner control layer via scoped slot.
 */
export const Disabled: Story = {
  args: {
    label: 'Organization ID',
    description: 'Managed by enterprise policy. Cannot be modified.',
    disabled: true,
  },
  render: (args) => ({
    components: { VFormField, VBox, VInput },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-sm">
        <VFormField v-bind="args" v-slot="{ id, isDisabled }">
          <VInput :id="id" :disabled="isDisabled" value="org_auraflux_production_01" />
        </VFormField>
      </VBox>
    `,
  }),
};
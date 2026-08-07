import type { Meta, StoryObj } from '@storybook/vue3';
import VFieldset, { type VFieldsetProps } from '@auraflux/design-system/components/molecules/forms/VFieldset.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Molecules/Forms/VFieldset',
  component: VFieldset,
  tags: ['autodocs'],
  args: {
    title: 'General Settings',
    description: 'Configure core preferences and general identifiers for your workspace.',
    padding: 'md',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
} satisfies Meta<VFieldsetProps>;

export default meta;
type Story = StoryObj<typeof VFieldset>;

/**
 * Default usage: Standard form field grouping with a title and description legend.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VFieldset, VFormField, VInput, VStack },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-lg">
        <VFieldset v-bind="args">
          <VStack gap="md">
            <VFormField label="Workspace Name" required>
              <template #default="{ id }">
                <VInput :id="id" placeholder="e.g. Acme Production" />
              </template>
            </VFormField>

            <VFormField label="Workspace Identifier (Slug)">
              <template #default="{ id }">
                <VInput :id="id" placeholder="acme-prod" />
              </template>
            </VFormField>
          </VStack>
        </VFieldset>
      </div>
    `,
  }),
};

/**
 * Title Only: A concise fieldset configuration without sub-description text.
 */
export const TitleOnly: Story = {
  args: {
    title: 'Security & Access',
    description: undefined,
  },
  render: (args) => ({
    components: { VFieldset, VFormField, VInput, VStack },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-lg">
        <VFieldset v-bind="args">
          <VStack gap="md">
            <VFormField label="API Access Key">
              <template #default="{ id }">
                <VInput :id="id" type="password" value="sk-live-992183182" />
              </template>
            </VFormField>
          </VStack>
        </VFieldset>
      </div>
    `,
  }),
};

/**
 * Custom Padding: Demonstrates spatial adjustments using theme tokens within complex layouts.
 */
export const LargePadding: Story = {
  args: {
    title: 'Advanced AI Parameters',
    description: 'Fine-tune temperature, tokens, and context behavior for generation models.',
    padding: 'lg',
  },
  render: (args) => ({
    components: { VFieldset, VFormField, VInput, VStack, VCluster, VButton },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-lg">
        <VFieldset v-bind="args">
          <VStack gap="md">
            <VFormField label="Temperature" description="Range from 0.0 to 1.0">
              <template #default="{ id }">
                <VInput :id="id" value="0.7" />
              </template>
            </VFormField>

            <VFormField label="Max Output Tokens">
              <template #default="{ id }">
                <VInput :id="id" value="4096" />
              </template>
            </VFormField>

            <VCluster gap="sm" justify="start" class="pt-2">
              <VButton attention="primary" size="sm">Save Parameters</VButton>
              <VButton attention="tertiary" size="sm">Reset</VButton>
            </VCluster>
          </VStack>
        </VFieldset>
      </div>
    `,
  }),
};
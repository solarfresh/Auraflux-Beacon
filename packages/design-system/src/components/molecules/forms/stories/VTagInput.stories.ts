import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import VTagInput, {type VTagInputProps} from '@auraflux/design-system/components/molecules/forms/VTagInput.vue';

const meta = {
  title: 'Molecules/Forms/VTagInput',
  component: VTagInput,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type and press enter...',
    disabled: false,
  },
} satisfies Meta<VTagInputProps>;

export default meta;
type Story = StoryObj<typeof VTagInput>;

/**
 * Default usage: Standard tag input for managing a list of strings.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VTagInput },
    setup() {
      const tags = ref(['Vue', 'TypeScript', 'AuraFlux']);
      return { args, tags };
    },
    template: `
      <VTagInput v-model="tags" v-bind="args" />
    `,
  }),
};

/**
 * Disabled State: Demonstrates the component in a non-interactive state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { VTagInput },
    setup() {
      const tags = ref(['Locked', 'Immutable']);
      return { args, tags };
    },
    template: `
      <VTagInput v-model="tags" v-bind="args" />
    `,
  }),
};

/**
 * Empty State: Shows how the input looks when no tags are present.
 */
export const Empty: Story = {
  render: (args) => ({
    components: { VTagInput },
    setup() {
      const tags = ref([]);
      return { args, tags };
    },
    template: `
      <VTagInput v-model="tags" v-bind="args" />
    `,
  }),
};

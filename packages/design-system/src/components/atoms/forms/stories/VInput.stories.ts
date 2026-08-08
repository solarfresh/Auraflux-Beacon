import type { Meta, StoryObj } from '@storybook/vue3';
import VInput, { type VInputProps } from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Forms/VInput',
  component: VInput,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    placeholder: 'Enter text...',
    type: 'text',
    attention: 'secondary',
    size: 'md',
    rounded: 'md',
    disabled: false,
  },
  argTypes: {
    attention: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    surface: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
} satisfies Meta<VInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      return { args };
    },
    template: `<VInput v-bind="args" />`,
  }),
};

/** Form Validation States (Intent) */
export const ValidationStates: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VInput placeholder="Default state..." />
          <VInput intent="success" placeholder="Valid input..." />
          <VInput intent="warning" placeholder="Warning input..." />
          <VInput intent="danger" placeholder="Invalid input (error)..." />
        </VCluster>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const SurfaceVariants: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VInput surface="outline" placeholder="Outline surface..." />
          <VInput surface="soft" placeholder="Soft surface..." />
          <VInput surface="ghost" placeholder="Ghost surface..." />
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VInput size="xs" placeholder="Extra small (xs)" />
          <VInput size="sm" placeholder="Small (sm)" />
          <VInput size="md" placeholder="Medium (md)" />
          <VInput size="lg" placeholder="Large (lg)" />
          <VInput size="xl" placeholder="Extra large (xl)" />
          <VInput size="2xl" placeholder="2X large (2xl)" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const RoundedStyles: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VInput rounded="none" placeholder="Rounded none" />
          <VInput rounded="sm" placeholder="Rounded sm" />
          <VInput rounded="md" placeholder="Rounded md" />
          <VInput rounded="lg" placeholder="Rounded lg" />
          <VInput rounded="full" placeholder="Rounded full (Search style)" />
        </VCluster>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VInput, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VInput modelValue="Pre-filled value" placeholder="Normal state" />
          <VInput disabled placeholder="Disabled state..." />
        </VCluster>
      </VBox>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import VTextarea, { type VTextareaProps } from '@auraflux/design-system/components/atoms/forms/VTextarea.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

const meta = {
  title: 'Atoms/Forms/VTextarea',
  component: VTextarea,
  tags: ['autodocs'],
  args: {
    modelValue: '',
    placeholder: 'Enter long description...',
    rows: 3,
    attention: 'secondary',
    size: 'md',
    rounded: 'md',
    disabled: false,
    resize: 'vertical',
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
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
  },
} satisfies Meta<VTextareaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VTextarea },
    setup() {
      return { args };
    },
    template: `<VTextarea v-bind="args" />`,
  }),
};

/** Form Validation States (Intent) */
export const ValidationStates: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea placeholder="Default state..." />
          <VTextarea intent="success" placeholder="Valid input..." />
          <VTextarea intent="warning" placeholder="Warning input..." />
          <VTextarea intent="danger" placeholder="Invalid input (error)..." />
        </VStack>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const SurfaceVariants: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea surface="outline" placeholder="Outline surface..." />
          <VTextarea surface="soft" placeholder="Soft surface..." />
          <VTextarea surface="ghost" placeholder="Ghost surface..." />
        </VStack>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea size="xs" placeholder="Extra small (xs)" rows="2" />
          <VTextarea size="sm" placeholder="Small (sm)" rows="2" />
          <VTextarea size="md" placeholder="Medium (md)" rows="3" />
          <VTextarea size="lg" placeholder="Large (lg)" rows="3" />
          <VTextarea size="xl" placeholder="Extra large (xl)" rows="4" />
          <VTextarea size="2xl" placeholder="2X large (2xl)" rows="4" />
        </VStack>
      </VBox>
    `,
  }),
};

export const RoundedStyles: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea rounded="none" placeholder="Rounded none" />
          <VTextarea rounded="sm" placeholder="Rounded sm" />
          <VTextarea rounded="md" placeholder="Rounded md" />
          <VTextarea rounded="lg" placeholder="Rounded lg" />
          <VTextarea rounded="xl" placeholder="Rounded xl" />
        </VStack>
      </VBox>
    `,
  }),
};

/** Resizing Options */
export const ResizeOptions: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea resize="vertical" placeholder="Resize vertical (default)" />
          <VTextarea resize="none" placeholder="Resize none (fixed size)" />
          <VTextarea resize="both" placeholder="Resize both (horizontal & vertical)" />
        </VStack>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VTextarea, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTextarea modelValue="Pre-filled multi-line text...\nLine 2\nLine 3" placeholder="Normal state" />
          <VTextarea disabled placeholder="Disabled state..." />
        </VStack>
      </VBox>
    `,
  }),
};
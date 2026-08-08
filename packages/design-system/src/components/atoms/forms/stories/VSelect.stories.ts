import type { Meta, StoryObj } from '@storybook/vue3';
import VSelect, { type VSelectProps } from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Atoms/Forms/VSelect',
  component: VSelect as any,
  tags: ['autodocs'],
  args: {
    modelValue: 'option1',
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
} satisfies Meta<VSelectProps<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VSelect },
    setup() {
      return { args };
    },
    template: `
      <VSelect v-bind="args">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </VSelect>
    `,
  }),
};

/** Form Validation States (Intent) */
export const ValidationStates: Story = {
  render: () => ({
    components: { VSelect, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VSelect model-value="default">
            <option value="default">Default state...</option>
          </VSelect>
          <VSelect intent="success" model-value="valid">
            <option value="valid">Valid selection...</option>
          </VSelect>
          <VSelect intent="warning" model-value="warning">
            <option value="warning">Warning selection...</option>
          </VSelect>
          <VSelect intent="danger" model-value="invalid">
            <option value="invalid">Invalid selection (error)...</option>
          </VSelect>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const SurfaceVariants: Story = {
  render: () => ({
    components: { VSelect, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VSelect surface="outline" model-value="outline">
            <option value="outline">Outline surface...</option>
          </VSelect>
          <VSelect surface="soft" model-value="soft">
            <option value="soft">Soft surface...</option>
          </VSelect>
          <VSelect surface="ghost" model-value="ghost">
            <option value="ghost">Ghost surface...</option>
          </VSelect>
        </VCluster>
      </VBox>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { VSelect, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VSelect size="xs" model-value="xs"><option value="xs">Extra small (xs)</option></VSelect>
          <VSelect size="sm" model-value="sm"><option value="sm">Small (sm)</option></VSelect>
          <VSelect size="md" model-value="md"><option value="md">Medium (md)</option></VSelect>
          <VSelect size="lg" model-value="lg"><option value="lg">Large (lg)</option></VSelect>
          <VSelect size="xl" model-value="xl"><option value="xl">Extra large (xl)</option></VSelect>
          <VSelect size="2xl" model-value="2xl"><option value="2xl">2X large (2xl)</option></VSelect>
        </VCluster>
      </VBox>
    `,
  }),
};

export const RoundedStyles: Story = {
  render: () => ({
    components: { VSelect, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VSelect rounded="none" model-value="none"><option value="none">Rounded none</option></VSelect>
          <VSelect rounded="sm" model-value="sm"><option value="sm">Rounded sm</option></VSelect>
          <VSelect rounded="md" model-value="md"><option value="md">Rounded md</option></VSelect>
          <VSelect rounded="lg" model-value="lg"><option value="lg">Rounded lg</option></VSelect>
          <VSelect rounded="full" model-value="full"><option value="full">Rounded full</option></VSelect>
        </VCluster>
      </VBox>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { VSelect, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md">
          <VSelect model-value="normal">
            <option value="normal">Normal state</option>
          </VSelect>
          <VSelect disabled model-value="disabled">
            <option value="disabled">Disabled state...</option>
          </VSelect>
        </VCluster>
      </VBox>
    `,
  }),
};
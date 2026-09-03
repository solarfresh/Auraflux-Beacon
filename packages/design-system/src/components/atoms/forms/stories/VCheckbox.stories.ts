import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import VCheckbox, { type VCheckboxProps } from '@auraflux/design-system/components/atoms/forms/VCheckbox.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Atoms/Forms/VCheckbox',
  component: VCheckbox,
  tags: ['autodocs'],
  args: {
    modelValue: false,
    attention: 'secondary',
    size: 'sm',
    rounded: 'sm',
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
      options: ['solid', 'outline', 'ghost', 'soft'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<VCheckboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic interactive checkbox story
 */
export const Default: Story = {
  render: (args) => ({
    components: { VCheckbox, VBox, VCluster, VTypography },
    setup() {
      const checked = ref(args.modelValue ?? false);
      return { args, checked };
    },
    template: `
      <VBox padding="md">
        <VCluster gap="xs" align="center">
          <VCheckbox v-bind="args" v-model="checked" id="demo-checkbox" />
          <VTypography tag="label" for="demo-checkbox" size="sm" class="cursor-pointer">
            Accept terms and conditions
          </VTypography>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Matrix displaying size variations mapped to system icon tokens
 */
export const Sizes: Story = {
  render: () => ({
    components: { VCheckbox, VBox, VCluster, VTypography },
    setup() {
      const checked = ref(true);
      return { checked };
    },
    template: `
      <VBox padding="md">
        <VCluster gap="md" align="center">
          <VCluster gap="xs" align="center">
            <VCheckbox v-model="checked" size="xs" id="size-xs" />
            <VTypography tag="label" for="size-xs" size="xs">XS</VTypography>
          </VCluster>

          <VCluster gap="xs" align="center">
            <VCheckbox v-model="checked" size="sm" id="size-sm" />
            <VTypography tag="label" for="size-sm" size="sm">SM</VTypography>
          </VCluster>

          <VCluster gap="xs" align="center">
            <VCheckbox v-model="checked" size="md" id="size-md" />
            <VTypography tag="label" for="size-md" size="md">MD</VTypography>
          </VCluster>

          <VCluster gap="xs" align="center">
            <VCheckbox v-model="checked" size="lg" id="size-lg" />
            <VTypography tag="label" for="size-lg" size="lg">LG</VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};

/**
 * Disabled state demonstration
 */
export const Disabled: Story = {
  render: () => ({
    components: { VCheckbox, VBox, VCluster, VTypography },
    template: `
      <VBox padding="md">
        <VCluster gap="lg" align="center">
          <VCluster gap="xs" align="center">
            <VCheckbox :model-value="false" :disabled="true" id="dis-unchecked" />
            <VTypography tag="label" for="dis-unchecked" size="sm" attention="tertiary">
              Disabled Unchecked
            </VTypography>
          </VCluster>

          <VCluster gap="xs" align="center">
            <VCheckbox :model-value="true" :disabled="true" id="dis-checked" />
            <VTypography tag="label" for="dis-checked" size="sm" attention="tertiary">
              Disabled Checked
            </VTypography>
          </VCluster>
        </VCluster>
      </VBox>
    `,
  }),
};
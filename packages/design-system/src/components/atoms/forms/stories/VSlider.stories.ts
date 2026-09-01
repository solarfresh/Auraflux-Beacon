import type { Meta, StoryObj } from '@storybook/vue3';
import VSlider, { type VSliderProps } from '@auraflux/design-system/components/atoms/forms/VSlider.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import { ref } from 'vue';

const meta = {
  title: 'Atoms/Forms/VSlider',
  component: VSlider,
  tags: ['autodocs'],
  args: {
    modelValue: 50,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    attention: 'secondary',
    disabled: false,
  },
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
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
      options: ['base', 'solid', 'soft', 'outline', 'ghost'],
    },
  },
} satisfies Meta<VSliderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VSlider, VStack, VTypography },
    setup() {
      const val = ref(args.modelValue);
      return { args, val };
    },
    template: `
      <VStack gap="xs" class="w-80">
        <VSlider v-bind="args" v-model="val" />
        <VTypography size="xs" class="font-mono">Value: {{ val }}</VTypography>
      </VStack>
    `,
  }),
};

/** Interactive RRF Weight Tuning Example */
export const InteractiveValue: Story = {
  render: () => ({
    components: { VSlider, VBox, VStack, VCluster, VTypography },
    setup() {
      const kFactor = ref(60);
      const vectorWeight = ref(1.0);
      const bm25Weight = ref(0.8);
      return { kFactor, vectorWeight, bm25Weight };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="w-96">
        <VStack gap="md">
          <VStack gap="xs">
            <VCluster justify="between" align="center">
              <VTypography size="xs" weight="bold">RRF k-factor</VTypography>
              <VTypography size="xs" class="font-mono">{{ kFactor }}</VTypography>
            </VCluster>
            <VSlider v-model="kFactor" :min="1" :max="100" :step="1" />
          </VStack>

          <VStack gap="xs">
            <VCluster justify="between" align="center">
              <VTypography size="xs" weight="bold">Vector Weight</VTypography>
              <VTypography size="xs" class="font-mono text-indigo-600">{{ vectorWeight }}</VTypography>
            </VCluster>
            <VSlider v-model="vectorWeight" :min="0" :max="2" :step="0.1" intent="brand" />
          </VStack>

          <VStack gap="xs">
            <VCluster justify="between" align="center">
              <VTypography size="xs" weight="bold">BM25 Weight</VTypography>
              <VTypography size="xs" class="font-mono text-emerald-600">{{ bm25Weight }}</VTypography>
            </VCluster>
            <VSlider v-model="bm25Weight" :min="0" :max="2" :step="0.1" intent="success" />
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Intent States (Validation & Hierarchy) */
export const IntentStates: Story = {
  render: () => ({
    components: { VSlider, VBox, VStack, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="w-full max-w-xl">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Neutral (Default)</VTypography>
            <VSlider :modelValue="50" intent="neutral" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Brand</VTypography>
            <VSlider :modelValue="60" intent="brand" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Success</VTypography>
            <VSlider :modelValue="75" intent="success" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Warning</VTypography>
            <VSlider :modelValue="40" intent="warning" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Danger</VTypography>
            <VSlider :modelValue="90" intent="danger" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Info</VTypography>
            <VSlider :modelValue="30" intent="info" />
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const SurfaceVariants: Story = {
  render: () => ({
    components: { VSlider, VBox, VStack, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="w-full max-w-xl">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Base Surface</VTypography>
            <VSlider surface="base" :modelValue="50" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Solid Surface</VTypography>
            <VSlider surface="solid" :modelValue="50" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Soft Surface</VTypography>
            <VSlider surface="soft" :modelValue="50" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Outline Surface</VTypography>
            <VSlider surface="outline" :modelValue="50" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Ghost Surface</VTypography>
            <VSlider surface="ghost" :modelValue="50" />
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Component Sizes */
export const Sizes: Story = {
  render: () => ({
    components: { VSlider, VBox, VStack, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="w-full max-w-xl">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Extra Small (xs)</VTypography>
            <VSlider size="xs" :modelValue="20" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Small (sm)</VTypography>
            <VSlider size="sm" :modelValue="40" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Medium (md)</VTypography>
            <VSlider size="md" :modelValue="60" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Large (lg)</VTypography>
            <VSlider size="lg" :modelValue="80" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Extra Large (xl)</VTypography>
            <VSlider size="xl" :modelValue="90" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">2X Large (2xl)</VTypography>
            <VSlider size="2xl" :modelValue="100" />
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** States (Disabled & Normal) */
export const States: Story = {
  render: () => ({
    components: { VSlider, VBox, VStack, VTypography },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="w-full max-w-xl">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Normal State</VTypography>
            <VSlider :modelValue="40" />
          </VStack>
          <VStack gap="xs">
            <VTypography size="xs" color="tertiary">Disabled State</VTypography>
            <VSlider disabled :modelValue="40" />
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};
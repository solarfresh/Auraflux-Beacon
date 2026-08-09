import type { Meta, StoryObj } from '@storybook/vue3';
import VSectionHeader, { type VSectionHeaderProps } from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';

const meta = {
  title: 'Molecules/Indicators/VSectionHeader',
  component: VSectionHeader,
  tags: ['autodocs'],
  args: {
    title: 'Core Proposition Initializer',
    titleTag: 'h3',
    icon: 'Sparkles',
    iconType: 'solid',
    size: 'md',
    weight: 'bold',
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
    iconType: {
      control: 'inline-radio',
      options: ['solid', 'outline'],
    },
  },
} satisfies Meta<VSectionHeaderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VSectionHeader },
    setup() {
      return { args };
    },
    template: `<VSectionHeader v-bind="args" />`,
  }),
};

/** UI Mockup Specific Examples */
export const UIMockupExamples: Story = {
  render: () => ({
    components: { VSectionHeader, VBox, VStack, VBadge },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <!-- Left Header Example -->
          <VSectionHeader
            title="Core Proposition Initializer"
            icon="Sparkles"
            intent="brand"
            size="lg"
          />

          <!-- Right Card Header Example -->
          <VSectionHeader
            title="Initial Reference Information"
            icon="PlusSquare"
            iconType="outline"
            size="sm"
          >
            <template #extra>
              <VBadge variant="secondary" size="sm">Core Context</VBadge>
            </template>
          </VSectionHeader>
        </VStack>
      </VBox>
    `,
  }),
};

/** Semantic Intent Variants */
export const SemanticIntents: Story = {
  render: () => ({
    components: { VSectionHeader, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VSectionHeader title="Brand / Main Proposition" icon="Sparkles" intent="brand" />
          <VSectionHeader title="Success Notification" icon="CheckCircle" intent="success" />
          <VSectionHeader title="Warning Context" icon="ExclamationTriangle" intent="warning" />
          <VSectionHeader title="Danger / Critical Alert" icon="XCircle" intent="danger" />
          <VSectionHeader title="Informational Header" icon="InformationCircle" intent="info" />
          <VSectionHeader title="Neutral Header" icon="DocumentText" intent="neutral" />
        </VStack>
      </VBox>
    `,
  }),
};

/** Typography and Icon Sizes */
export const Sizes: Story = {
  render: () => ({
    components: { VSectionHeader, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VSectionHeader size="xs" title="Extra Small (xs)" icon="Bookmark" />
          <VSectionHeader size="sm" title="Small (sm)" icon="Bookmark" />
          <VSectionHeader size="md" title="Medium (md)" icon="Bookmark" />
          <VSectionHeader size="lg" title="Large (lg)" icon="Bookmark" />
          <VSectionHeader size="xl" title="Extra Large (xl)" icon="Bookmark" />
          <VSectionHeader size="2xl" title="2X Large (2xl)" icon="Bookmark" />
        </VStack>
      </VBox>
    `,
  }),
};

/** Header with Extra Slot Elements (Badges / Actions) */
export const WithExtraSlot: Story = {
  render: () => ({
    components: { VSectionHeader, VBox, VCluster, VBadge },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster justify="between" align="center" class="w-full">
          <VSectionHeader
            title="Page Knowledge Base"
            icon="CircleStack"
            size="md"
          >
            <template #extra>
              <VBadge variant="primary" size="sm">0</VBadge>
            </template>
          </VSectionHeader>
        </VCluster>
      </VBox>
    `,
  }),
};
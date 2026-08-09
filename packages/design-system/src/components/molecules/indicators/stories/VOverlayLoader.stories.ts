import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import VOverlayLoader, { type VOverlayLoaderProps } from '@auraflux/design-system/components/molecules/indicators/VOverlayLoader.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Molecules/Indicators/VOverlayLoader',
  component: VOverlayLoader,
  tags: ['autodocs'],
  args: {
    message: 'Loading data...',
    detail: 'Please wait while we synchronize your governance settings.',
    intent: 'brand',
    iconSize: '2xl',
    iconName: 'ArrowPath',
    iconType: 'solid',
  },
} satisfies Meta<VOverlayLoaderProps>;

export default meta;
type Story = StoryObj<typeof VOverlayLoader>;

/**
 * Default usage: Interactive toggle demonstrating full-screen overlay during critical operations.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VOverlayLoader, VButton, VStack, VTypography },
    setup() {
      const showOverlay = ref(false);
      const toggleOverlay = () => {
        showOverlay.value = true;
        setTimeout(() => {
          showOverlay.value = false;
        }, 3000);
      };
      return { args, showOverlay, toggleOverlay };
    },
    template: `
      <VStack gap="md" align="start">
        <VTypography size="sm">
          Click the button below to trigger the overlay loader (auto-dismisses after 3 seconds).
        </VTypography>

        <VButton attention="primary" @click="toggleOverlay">
          Trigger Overlay Loader
        </VButton>

        <VOverlayLoader v-if="showOverlay" v-bind="args" />
      </VStack>
    `,
  }),
};

/**
 * With Detail: Displays secondary information text below the primary loading message.
 */
export const WithDetail: Story = {
  args: {
    message: 'Processing Deployment',
    detail: 'Uploading smart contract binary to the validator network. This might take up to 30 seconds.',
    intent: 'brand',
  },
  render: (args) => ({
    components: { VOverlayLoader, VButton, VStack, VTypography },
    setup() {
      const showOverlay = ref(false);
      return { args, showOverlay };
    },
    template: `
      <VStack gap="md" align="start">
        <VButton attention="secondary" @click="showOverlay = !showOverlay">
          Toggle Preview
        </VButton>

        <VOverlayLoader v-if="showOverlay" v-bind="args" />
      </VStack>
    `,
  }),
};

/**
 * Custom Intent & Icon: Uses alternative intent colors and custom icons (e.g. for sync or danger actions).
 */
export const CustomIntent: Story = {
  args: {
    message: 'System Rollback in Progress',
    detail: 'Restoring previous node configurations. Please do not close the window.',
    intent: 'danger',
    iconName: 'ArrowPath',
    iconSize: '2xl',
  },
  render: (args) => ({
    components: { VOverlayLoader, VButton, VStack },
    setup() {
      const showOverlay = ref(false);
      return { args, showOverlay };
    },
    template: `
      <VStack gap="md" align="start">
        <VButton attention="primary" intent="danger" @click="showOverlay = !showOverlay">
          Toggle Danger Intent Overlay
        </VButton>

        <VOverlayLoader v-if="showOverlay" v-bind="args" />
      </VStack>
    `,
  }),
};
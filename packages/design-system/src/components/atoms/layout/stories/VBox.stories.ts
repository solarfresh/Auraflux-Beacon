import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VBox, {type VBoxProps} from '@auraflux/design-system/components/atoms/layout/VBox.vue';

/**
 * `VBox` is the core skin/theme container for the Design System.
 * Strictly adheres to Design Tokens to manage padding, border, background, and clickable interactions.
 */
const meta = {
  title: 'Atoms/Layout/VBox',
  component: VBox,
  tags: ['autodocs'], // 💡 Storybook auto-generates argTypes (Controls) directly from `defineProps`, no manual argTypes needed!
  args: {
    tag: 'div',
    padding: 'md',
    border: 'all',
    rounded: 'md',
    theme: 'base',
    clickable: false,
  },
} satisfies Meta<VBoxProps>;

export default meta;
type Story = StoryObj<VBoxProps>;

// -----------------------------------------------------------------------------
// 1. Basic Scenario (Default)
// -----------------------------------------------------------------------------
export const Default: Story = {
  render: (args) => ({
    components: { VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args">
        <VTypography size="md" theme="info" class="font-mono">Card container using default tokens.</VTypography>
      </VBox>
    `,
  }),
};

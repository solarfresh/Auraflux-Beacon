import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

// 🎯 Extract exact props type from component to ensure TS auto-completion & type checking
type VBoxProps = InstanceType<typeof VBox>['$props'];

/**
 * `VBox` is the core skin/surface container for the Design System.
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
    background: 'white',
    rounded: true,
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
        <p class="text-slate-700">Card container using default tokens.</p>
      </VBox>
    `,
  }),
};

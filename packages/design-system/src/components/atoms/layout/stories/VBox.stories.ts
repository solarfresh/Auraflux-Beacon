import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { userEvent, expect, within } from '@storybook/test';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

/**
 * `VBox` is the core atomic layout container for the Design System.
 * Supports multiple semantic HTML tags via `as`, Flexbox alignment controls, and smart Tailwind class merging.
 */
const meta: Meta<typeof VBox> = {
  title: 'Atoms/VBox',
  component: VBox,
  tags: ['autodocs'], // Automatically generates the API documentation table
  argTypes: {
    // Dropdown control for HTML semantic tags
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer'],
      description: 'Specifies the semantic HTML tag to render',
      table: {
        defaultValue: { summary: 'div' },
      },
    },
    // Flex direction
    direction: {
      control: 'select',
      options: ['col', 'row', 'col-reverse', 'row-reverse'],
      description: 'Flexbox direction for child elements',
      table: {
        defaultValue: { summary: 'col' },
      },
    },
    // Main axis alignment (justify)
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis (justify-content) alignment',
      table: {
        defaultValue: { summary: 'start' },
      },
    },
    // Cross axis alignment (align)
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Cross-axis (align-items) alignment',
      table: {
        defaultValue: { summary: 'start' },
      },
    },
    // Gap size between elements
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spacing between child items',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    // Default slot content control
    default: {
      control: 'text',
      description: 'Default slot content',
    },
  },
  // Default argument values
  args: {
    as: 'div',
    direction: 'col',
    justify: 'start',
    align: 'start',
    gap: 'md',
    default: 'VBox default container content',
  },
};

export default meta;
type Story = StoryObj<typeof VBox>;

// -----------------------------------------------------------------------------
// 1. Basic Usage (Default)
// -----------------------------------------------------------------------------
export const Default: Story = {
  render: (args) => ({
    components: { VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args" class="p-6 bg-slate-100 rounded-lg border border-slate-300">
        <div class="p-4 bg-blue-500 text-white rounded">Card Item 1</div>
        <div class="p-4 bg-blue-600 text-white rounded">Card Item 2</div>
        <div class="p-4 bg-blue-700 text-white rounded">Card Item 3</div>
      </VBox>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 2. Horizontal Layout & Spacing (Row Layout)
// -----------------------------------------------------------------------------
export const HorizontalRow: Story = {
  args: {
    direction: 'row',
    align: 'center',
    justify: 'between',
    gap: 'lg',
  },
  render: (args) => ({
    components: { VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args" class="p-6 bg-slate-800 text-white rounded-xl w-full">
        <div>
          <h3 class="text-lg font-bold">Section Header</h3>
          <p class="text-sm text-slate-400">Example of a horizontally aligned VBox layout</p>
        </div>
        <VBox direction="row" gap="sm">
          <button class="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600">Cancel</button>
          <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">Confirm</button>
        </VBox>
      </VBox>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 3. Semantic Tag Showcase
// -----------------------------------------------------------------------------
export const AsSection: Story = {
  args: {
    as: 'section',
    gap: 'sm',
  },
  render: (args) => ({
    components: { VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args" class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r">
        <h4 class="font-semibold text-amber-800">Semantic Section (&lt;section&gt;)</h4>
        <p class="text-sm text-amber-700">Inspect the DOM element to verify this container renders as a &lt;section&gt; tag instead of the default &lt;div&gt;.</p>
      </VBox>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 4. Class Overriding & Merge Validation (Tailwind Merge)
// -----------------------------------------------------------------------------
export const ClassOverride: Story = {
  render: () => ({
    components: { VBox },
    template: `
      <div class="space-y-4">
        <p class="text-xs text-slate-500 font-mono">Verifies whether tailwind-merge correctly overrides inner p-2 with external p-8:</p>
        <VBox class="p-2 p-8 bg-emerald-100 text-emerald-900 rounded-lg">
          <span class="font-bold">Container content with overridden p-8 (32px padding)</span>
        </VBox>
      </div>
    `,
  }),
};

// -----------------------------------------------------------------------------
// 5. Automated Interaction Testing (Play Function)
// -----------------------------------------------------------------------------
export const InteractiveTest: Story = {
  args: {
    direction: 'col',
    gap: 'md',
  },
  render: (args) => ({
    components: { VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox v-bind="args" data-testid="vbox-container" class="p-6 bg-white shadow-md rounded-lg">
        <button data-testid="test-btn" class="px-4 py-2 bg-blue-600 text-white rounded">Click Me</button>
        <span data-testid="test-status" class="text-sm text-slate-600">Not Clicked</span>
      </VBox>
    `,
  }),
  // 🎯 Automated assertions via play function, replayable in Storybook's Interactions panel
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1. Assert that the VBox container correctly renders in the DOM
    const container = canvas.getByTestId('vbox-container');
    await expect(container).toBeInTheDocument();

    // 2. Simulate user click interaction on the button
    const button = canvas.getByTestId('test-btn');
    await userEvent.click(button);

    // 3. Assert that the clicked button receives active focus
    await expect(button).toHaveFocus();
  },
};
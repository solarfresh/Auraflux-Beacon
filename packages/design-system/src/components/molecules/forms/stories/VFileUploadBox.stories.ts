import type { Meta, StoryObj } from '@storybook/vue3';
import VFileUploadBox, { type VFileUploadBoxProps } from '@auraflux/design-system/components/molecules/forms/VFileUploadBox.vue';

const meta = {
  title: 'Molecules/Forms/VFileUploadBox',
  component: VFileUploadBox,
  tags: ['autodocs'],
  args: {
    accept: '.pdf,.txt,.md,.json',
    multiple: false,
    disabled: false,
  },
  argTypes: {
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<VFileUploadBoxProps>;

export default meta;
type Story = StoryObj<typeof VFileUploadBox>;

/**
 * Default usage: Standard drag-and-drop file uploader with click triggering.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VFileUploadBox },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-md">
        <VFileUploadBox v-bind="args" />
      </div>
    `,
  }),
};

/**
 * Multiple Files Selection: Allows selecting or dropping multiple files at once.
 */
export const MultipleFiles: Story = {
  args: {
    multiple: true,
    accept: 'image/*',
  },
  render: (args) => ({
    components: { VFileUploadBox },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-md">
        <VFileUploadBox v-bind="args">
          <template #title>Upload multiple images</template>
          <template #description>PNG, JPG, SVG, or WEBP up to 10MB</template>
        </VFileUploadBox>
      </div>
    `,
  }),
};

/**
 * Custom Slots: Customizing title and description slots for domain-specific context.
 */
export const CustomContent: Story = {
  args: {
    accept: '.json,.yaml',
  },
  render: (args) => ({
    components: { VFileUploadBox },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-md">
        <VFileUploadBox v-bind="args">
          <template #title>Import Agent Configuration</template>
          <template #description>Drop your system prompt schema (.json or .yaml)</template>
        </VFileUploadBox>
      </div>
    `,
  }),
};

/**
 * Disabled State: Non-interactive upload area with lowered opacity.
 */
export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { VFileUploadBox },
    setup() {
      return { args };
    },
    template: `
      <div class="max-w-md">
        <VFileUploadBox v-bind="args" />
      </div>
    `,
  }),
};
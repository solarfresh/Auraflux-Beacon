import type { Meta, StoryObj } from '@storybook/vue3';
import VFileUploadBox, {type VFileUploadBoxProps} from '@auraflux/design-system/components/molecules/forms/VFileUploadBox.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

const meta = {
  title: 'Molecules/Forms/VFileUploadBox',
  component: VFileUploadBox,
  tags: ['autodocs'],
  args: {
    accept: '.pdf,.txt,.md,.json',
    multiple: false,
    disabled: false,
  },
} satisfies Meta<VFileUploadBoxProps>;

export default meta;
type Story = StoryObj<typeof VFileUploadBox>;

/**
 * Default usage: Standard drag-and-drop file uploader with click triggering.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VFileUploadBox, VBox },
    setup() {
      const handleFileChange = (files: File[]) => {
        console.log('Selected files:', files);
      };
      return { args, handleFileChange };
    },
    template: `
      <VBox class="max-w-md">
        <VFileUploadBox v-bind="args" @change="handleFileChange" />
      </VBox>
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
    components: { VFileUploadBox, VBox },
    setup() {
      const handleFileChange = (files: File[]) => {
        console.log('Selected multiple files:', files);
      };
      return { args, handleFileChange };
    },
    template: `
      <VBox class="max-w-md">
        <VFileUploadBox v-bind="args" @change="handleFileChange">
          <template #title>Upload multiple images</template>
          <template #description>PNG, JPG, SVG, or WEBP up to 10MB</template>
        </VFileUploadBox>
      </VBox>
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
    components: { VFileUploadBox, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-md">
        <VFileUploadBox v-bind="args">
          <template #title>Import Agent Configuration</template>
          <template #description>Drop your system prompt schema (.json or .yaml)</template>
        </VFileUploadBox>
      </VBox>
    `,
  }),
};

/**
 * Disabled State: Non-interactive upload area with lowered opacity.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { VFileUploadBox, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-md">
        <VFileUploadBox v-bind="args" />
      </VBox>
    `,
  }),
};
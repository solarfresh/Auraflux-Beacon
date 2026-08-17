import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import PromptSchemaPanel, { type PromptSchemaFormData } from '@auraflux/design-system/components/organisms/panels/PromptSchemaPanel.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Organisms/Panels/PromptSchemaPanel',
  component: PromptSchemaPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PromptSchemaPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default Empty Form State */
export const Default: Story = {
  render: () => ({
    components: { PromptSchemaPanel, VBox },
    setup() {
      const formData = ref<PromptSchemaFormData>({
        intent: '',
        systemPrompt: '',
        userPromptTemplate: '',
        schemaFields: [],
      });

      return { formData };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-100 p-4">
        <PromptSchemaPanel v-model="formData" />
      </VBox>
    `,
  }),
};

/** Pre-populated Interactive Form State */
export const WithInitialData: Story = {
  render: () => ({
    components: { PromptSchemaPanel, VBox },
    setup() {
      const formData = ref<PromptSchemaFormData>({
        intent: 'Extract entities.',
        systemPrompt: 'Be concise.',
        userPromptTemplate: 'Input: {{ text }}',
        schemaFields: [
          {
            id: 'field-1',
            name: 'triples',
            type: 'Array[SPO]',
            badgeText: 'Basis',
            badgeIntent: 'warning',
          },
          {
            id: 'field-2',
            name: 'tags',
            type: 'Array[String]',
            badgeText: 'Tag',
            badgeIntent: 'neutral',
          },
        ],
      });

      const handleSubmit = (data: PromptSchemaFormData) => {
        console.log('Submitted:', data);
      };

      return { formData, handleSubmit };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-100 p-4">
        <PromptSchemaPanel
          v-model="formData"
          @submit="handleSubmit"
        />
      </VBox>
    `,
  }),
};
import EmbeddingSearchConfigPanel from '@auraflux/design-system/components/organisms/panels/EmbeddingSearchConfigPanel.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import type { EmbeddingRrfConfigFormData } from '@auraflux/design-system/interfaces/agents';

const meta = {
  title: 'Organisms/Panels/EmbeddingSearchConfigPanel',
  component: EmbeddingSearchConfigPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EmbeddingSearchConfigPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default Form State with Pre-configured Options and Values */
export const Default: Story = {
  render: () => ({
    components: { EmbeddingSearchConfigPanel, VBox },
    setup() {
      const formData = ref<EmbeddingRrfConfigFormData>({
        providerId: 'openai',
        modelFamilyId: 'text-embedding-3-small',
        dimensions: 1536,
        candidateTopN: 50,
        kFactor: 60,
        vectorWeight: 1.0,
        bm25Weight: 0.8,
        topK: 5,
        scoreCutoff: '0.0150',
      });

      const handleSubmit = (data: EmbeddingRrfConfigFormData) => {
        console.log('Submitted:', data);
      };

      return { formData, handleSubmit };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-100 p-4">
        <EmbeddingSearchConfigPanel
          v-model="formData"
          @submit="handleSubmit"
        />
      </VBox>
    `,
  }),
};

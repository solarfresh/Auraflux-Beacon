import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import AgentPreviewPanel, { type AgentPreviewPanelProps } from '@auraflux/design-system/components/organisms/panels/AgentPreviewPanel.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Organisms/Panels/AgentPreviewPanel',
  component: AgentPreviewPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AgentPreviewPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default Empty / Initial State */
export const Default: Story = {
  render: () => ({
    components: { AgentPreviewPanel, VBox },
    setup() {
      const variableValues = ref<Record<string, string>>({});

      const handleRun = () => {
        console.log('Run test triggered with values:', variableValues.value);
      };

      return { variableValues, handleRun };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-950 p-4 flex justify-end">
        <AgentPreviewPanel
          @run="handleRun"
          @update:variable-values="val => variableValues = val"
        />
      </VBox>
    `,
  }),
};

/** Structured JSON Output State (Schema Constrained) */
export const StructuredOutput: Story = {
  render: () => ({
    components: { AgentPreviewPanel, VBox },
    setup() {
      const benchProps = ref<AgentPreviewPanelProps>({
        variables: [
          { name: 'input_text', type: 'string', multiline: true, defaultValue: 'AuraFlux is a design system built with Vue 3.' },
          { name: 'language', type: 'string', multiline: false, defaultValue: 'en' }
        ],
        hasOutputSchema: true,
        isSchemaValid: true,
        responseOutput: {
          status: 'success',
          entities: [
            { name: 'AuraFlux', category: 'Design System' },
            { name: 'Vue 3', category: 'Framework' }
          ]
        },
        metrics: {
          latency: 1.18,
          tokens: 148
        },
        isLoading: false
      });

      const handleRun = () => {
        benchProps.value.isLoading = true;
        setTimeout(() => {
          benchProps.value.isLoading = false;
        }, 1000);
      };

      return { benchProps, handleRun };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-950 p-4 flex justify-end">
        <AgentPreviewPanel
          v-bind="benchProps"
          @run="handleRun"
        />
      </VBox>
    `,
  }),
};

/** Non-Structured Markdown Fallback State (Free-form Text) */
export const UnstructuredMarkdownOutput: Story = {
  render: () => ({
    components: { AgentPreviewPanel, VBox },
    setup() {
      const benchProps = ref<AgentPreviewPanelProps>({
        variables: [
          { name: 'user_query', type: 'string', multiline: true, defaultValue: 'Explain the benefits of Tailwind CSS.' }
        ],
        hasOutputSchema: false,
        rawMarkdownOutput: `### Benefits of Tailwind CSS\n\n* **Utility-First**: Rapid UI development without leaving your HTML.\n* **Design Tokens**: Enforces consistent spacing, typography, and colors.`,
        metrics: {
          latency: 0.85,
          tokens: 92
        },
        isLoading: false
      });

      return { benchProps };
    },
    template: `
      <VBox class="h-screen w-full bg-gray-950 p-4 flex justify-end">
        <AgentPreviewPanel v-bind="benchProps" />
      </VBox>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import VAgentToolbar from '@auraflux/design-system/components/organisms/navs/VAgentToolbar.vue';
import type { Agent, ModelOption, ProviderOption } from '@auraflux/design-system/interfaces/agents';

// Mock Providers & Models Data
const mockProviders: ProviderOption[] = [
  { label: 'OpenAI', value: 'provider-openai-01' },
  { label: 'Anthropic', value: 'provider-anthropic-01' },
  { label: 'Google Gemini', value: 'provider-google-01' },
];

const mockModels: ModelOption[] = [
  { label: 'gpt-4o-mini', value: 'mf-gpt-4o-mini', providerId: 'provider-openai-01' },
  { label: 'gpt-4o', value: 'mf-gpt-4o', providerId: 'provider-openai-01' },
  { label: 'claude-3-5-haiku', value: 'mf-claude-haiku', providerId: 'provider-anthropic-01' },
  { label: 'claude-3-5-sonnet', value: 'mf-claude-sonnet', providerId: 'provider-anthropic-01' },
  { label: 'gemini-1.5-flash', value: 'mf-gemini-flash', providerId: 'provider-google-01' },
  { label: 'gemini-1.5-pro', value: 'mf-gemini-pro', providerId: 'provider-google-01' },
];

// Mock Agents Data aligned with Agent interface
const mockAgents: Agent[] = [
  {
    id: 'agent-01',
    name: '🔍 Triple Extractor',
    purpose: 'Extract SPO triples and tags from unstructured text.',
    providerId: 'provider-openai-01',
    modelFamilyId: 'mf-gpt-4o-mini',
    status: 'DRAFT',
  },
  {
    id: 'agent-02',
    name: '🛡️ Schema Validator',
    purpose: 'Verify output JSON schema structure and field constraints.',
    providerId: 'provider-anthropic-01',
    modelFamilyId: 'mf-claude-haiku',
    status: 'REVIEW',
  },
  {
    id: 'agent-03',
    name: '🧠 Concept Reasoner',
    purpose: 'Generate high-level conceptual abstractions and core questions.',
    providerId: 'provider-google-01',
    modelFamilyId: 'mf-gemini-pro',
    status: 'ACTIVE',
  },
];

const meta = {
  title: 'Organisms/Navs/VAgentToolbar',
  component: VAgentToolbar,
  tags: ['autodocs'],
  args: {
    agents: mockAgents,
    providers: mockProviders,
    models: mockModels,
    isDirty: false,
    selectedProvider: 'provider-openai-01',
    selectedModel: 'mf-gpt-4o-mini',
  },
  argTypes: {
    isDirty: { control: 'boolean' },
    selectedProvider: { control: 'text' },
    selectedModel: { control: 'text' },
    agents: { control: 'object' },
    providers: { control: 'object' },
    models: { control: 'object' },
  },
} satisfies Meta<typeof VAgentToolbar>;

export default meta;
type Story = StoryObj<typeof VAgentToolbar>;

/**
 * Default usage: Interactive toolbar bound with provider and model props using IDs.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VAgentToolbar },
    setup() {
      const handleSave = () => alert('Save Settings triggered');
      const handleSelectAgent = (agent: Agent) => console.log('Selected Agent:', agent);
      const handleStatusChange = (status: string) => console.log('Status changed to:', status);

      return { args, handleSave, handleSelectAgent, handleStatusChange };
    },
    template: `
      <VAgentToolbar
        v-bind="args"
        v-model:selectedProvider="args.selectedProvider"
        v-model:selectedModel="args.selectedModel"
        @save="handleSave"
        @select-agent="handleSelectAgent"
        @status-change="handleStatusChange"
      />
    `,
  }),
};

/**
 * Unsaved Draft State: Indicates pending changes with an amber status badge on the button.
 */
export const UnsavedDraft: Story = {
  args: {
    agents: [mockAgents[0]],
    providers: mockProviders,
    models: mockModels,
    isDirty: true,
    selectedProvider: 'provider-openai-01',
    selectedModel: 'mf-gpt-4o-mini',
  },
  render: (args) => ({
    components: { VAgentToolbar },
    setup() {
      return { args };
    },
    template: `<VAgentToolbar v-bind="args" />`,
  }),
};

/**
 * Unselected / Placeholder State: Demonstrates fallback behavior when no provider or model is selected.
 */
export const UnselectedState: Story = {
  args: {
    agents: mockAgents,
    providers: mockProviders,
    models: mockModels,
    isDirty: false,
    selectedProvider: '',
    selectedModel: '',
  },
  render: (args) => ({
    components: { VAgentToolbar },
    setup() {
      return { args };
    },
    template: `<VAgentToolbar v-bind="args" />`,
  }),
};

/**
 * Empty State: Fallback layout when no agents are provided.
 */
export const EmptyState: Story = {
  args: {
    agents: [],
    providers: mockProviders,
    models: mockModels,
    isDirty: false,
  },
  render: (args) => ({
    components: { VAgentToolbar },
    setup() {
      return { args };
    },
    template: `<VAgentToolbar v-bind="args" />`,
  }),
};
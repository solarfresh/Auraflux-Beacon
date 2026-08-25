import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VModelProviderCard from '@auraflux/design-system/components/organisms/resources/VModelProviderCard.vue';
import type { ModelFamilies, ModelProvider } from '@auraflux/design-system/interfaces/agents';
import type { Meta, StoryObj } from '@storybook/vue3';

const mockSupportedFamilies: ModelFamilies[] = [
  {
    id: 'mf-gpt-4o',
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    description: 'Flagship multimodal model for high-intelligence tasks.',
    inputTokenLimit: 128000,
    outputTokenLimit: 16384,
  },
  {
    id: 'mf-gpt-4o-mini',
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    description: 'Fast and cost-efficient model for lightweight tasks.',
    inputTokenLimit: 128000,
    outputTokenLimit: 16384,
  },
  {
    id: 'mf-o1-preview',
    name: 'o1-preview',
    displayName: 'o1 Preview',
    description: 'Reasoning model designed to solve hard problems.',
    inputTokenLimit: 128000,
    outputTokenLimit: 32768,
  },
  {
    id: 'mf-claude-haiku',
    name: 'claude-3-5-haiku',
    displayName: 'Claude 3.5 Haiku',
    description: 'Near-instant responsiveness with high efficiency.',
    inputTokenLimit: 200000,
    outputTokenLimit: 8192,
  },
  {
    id: 'mf-claude-sonnet',
    name: 'claude-3-5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    description: 'Optimal balance of speed and advanced intelligence.',
    inputTokenLimit: 200000,
    outputTokenLimit: 8192,
  },
  {
    id: 'mf-llama-3',
    name: 'llama-3.1-70b',
    displayName: 'Llama 3.1 70B',
    description: 'Open-weight state-of-the-art model for private hosting.',
    inputTokenLimit: 131072,
    outputTokenLimit: 4096,
  },
];

// Mock ModelProvider Data
const mockHealthyProvider: ModelProvider = {
  id: 'provider-openai-01',
  name: 'Production OpenAI',
  type: 'OPENAI',
  status: 'ONLINE',
  apiKeyFingerprint: '••••4n2z',
  baseUrl: 'https://api.openai.com/v1',
  latencyMs: 120,
  lastVerifiedAt: '2026-08-16T08:00:00Z',
  supportedFamilies: [
    mockSupportedFamilies[0], // GPT-4o
    mockSupportedFamilies[1], // GPT-4o Mini
    mockSupportedFamilies[2], // o1 Preview
  ],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-08-15T10:00:00Z',
};

const mockDegradedProvider: ModelProvider = {
  ...mockHealthyProvider,
  id: 'provider-anthropic-01',
  name: 'Anthropic Primary',
  type: 'ANTHROPIC',
  status: 'DEGRADED',
  apiKeyFingerprint: '••••8k9p',
  baseUrl: 'https://api.anthropic.com',
  latencyMs: 1450,
  supportedFamilies: [
    mockSupportedFamilies[3], // Claude 3.5 Haiku
    mockSupportedFamilies[4], // Claude 3.5 Sonnet
  ],
};

const mockOfflineProvider: ModelProvider = {
  ...mockHealthyProvider,
  id: 'provider-vllm-01',
  name: 'Local vLLM Cluster',
  type: 'CUSTOM',
  status: 'OFFLINE',
  apiKeyFingerprint: '••••1z3x',
  baseUrl: 'https://vllm.internal.auraflux.ai/v1',
  latencyMs: null,
  supportedFamilies: [
    mockSupportedFamilies[5], // Llama 3.1 70B
  ],
};

const meta = {
  title: 'Organisms/Resources/VModelProviderCard',
  component: VModelProviderCard,
  tags: ['autodocs'],
  args: {
    provider: mockHealthyProvider,
    clickable: true,
    hoverable: true,
    padding: 'md',
    rounded: 'xl',
  },
  argTypes: {
    padding: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    rounded: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    clickable: { control: 'boolean' },
    hoverable: { control: 'boolean' },
    provider: { control: 'object' },
  },
} satisfies Meta<typeof VModelProviderCard>;

export default meta;
type Story = StoryObj<typeof VModelProviderCard>;

/**
 * Default Usage: Healthy operational state with actions slot.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VModelProviderCard, VButton, VBox, VIcon },
    setup() {
      const handleEdit = () => console.log('Edit clicked for:', args.provider.id);
      return { args, handleEdit };
    },
    template: `
      <VBox class="max-w-md">
        <VModelProviderCard v-bind="args">
          <template #actions>
            <VButton
              intent="neutral"
              surface="ghost"
              size="xs"
              @click.stop="handleEdit"
            >
              <VIcon name="Pencil" size="xs" />
            </VButton>
          </template>
        </VModelProviderCard>
      </VBox>
    `,
  }),
};

/**
 * Degraded State: High latency warning indicated with warning tokens.
 */
export const DegradedState: Story = {
  args: {
    provider: mockDegradedProvider,
  },
  render: (args) => ({
    components: { VModelProviderCard, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-md">
        <VModelProviderCard v-bind="args" />
      </VBox>
    `,
  }),
};

/**
 * Offline State: Connection issue or service down state with error tokens.
 */
export const OfflineState: Story = {
  args: {
    provider: mockOfflineProvider,
  },
  render: (args) => ({
    components: { VModelProviderCard, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-md">
        <VModelProviderCard v-bind="args" />
      </VBox>
    `,
  }),
};

/**
 * Non-interactive / Static Card Mode.
 */
export const NonInteractive: Story = {
  args: {
    provider: mockHealthyProvider,
    clickable: false,
    hoverable: false,
  },
  render: (args) => ({
    components: { VModelProviderCard, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox class="max-w-md">
        <VModelProviderCard v-bind="args" />
      </VBox>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import HybridSearchPlaygroundPanel from '@auraflux/design-system/components/organisms/panels/HybridSearchPlaygroundPanel.vue';

const meta: Meta<typeof HybridSearchPlaygroundPanel> = {
  title: 'Organisms/Panels/HybridSearchPlaygroundPanel',
  component: HybridSearchPlaygroundPanel,
  tags: ['autodocs'],
  argTypes: {
    queryText: {
      control: 'text',
      description: 'Two-way bound search query text',
    },
    isSearching: {
      control: 'boolean',
      description: 'Loading state for the run test action',
    },
    'onUpdate:queryText': { action: 'update:queryText' },
    'onRun-test': { action: 'run-test' },
  },
  args: {
    queryText: 'hybrid search optimization with RRF ranking',
    isSearching: false,
  },
};

export default meta;
type Story = StoryObj<typeof HybridSearchPlaygroundPanel>;

/**
 * Default state with sample hybrid search rank breakdown results.
 */
export const Default: Story = {
  args: {
    queryText: 'OpenSearch reciprocal rank fusion tutorial',
    isSearching: false,
    metrics: {
      latency: 42,
      tokens: 128,
      status: 'Active',
    },
    breakdownData: [
      {
        id: 1,
        rrfRank: '#1',
        content: 'Reciprocal Rank Fusion (RRF) is a method to combine multiple search results...',
        vectorRank: '#2',
        bm25Rank: '#1',
        score: '0.0328',
      },
      {
        id: 2,
        rrfRank: '#2',
        content: 'OpenSearch hybrid search uses neural search pipeline to merge k-NN and BM25...',
        vectorRank: '#1',
        bm25Rank: '#4',
        score: '0.0312',
      },
      {
        id: 3,
        rrfRank: '#3',
        content: 'Tuning weights in RRF pipelines allows prioritizing semantic over keyword matching...',
        vectorRank: '#3',
        bm25Rank: '#2',
        score: '0.0295',
      },
      {
        id: 4,
        rrfRank: '#4',
        content: 'Evaluating search relevance using normalized discounted cumulative gain (NDCG)...',
        vectorRank: '#5',
        bm25Rank: '#3',
        score: '0.0241',
      },
    ],
  },
};

/**
 * Loading state when the search test query is being executed.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isSearching: true,
  },
};

/**
 * Empty state before any test search has been executed.
 */
export const Empty: Story = {
  args: {
    queryText: '',
    isSearching: false,
    metrics: {
      latency: 0,
      tokens: 0,
      status: 'Idle',
    },
    breakdownData: [],
  },
};
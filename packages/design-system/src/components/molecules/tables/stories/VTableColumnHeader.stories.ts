import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableColumnHeader, {
  type SortOrder,
  type VTableColumnHeaderProps,
} from '@auraflux/design-system/components/molecules/tables/VTableColumnHeader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

const meta = {
  title: 'Molecules/Tables/VTableColumnHeader',
  component: VTableColumnHeader,
  tags: ['autodocs'],
  args: {
    align: 'start',
    sortable: true,
    sortOrder: false,
    hint: 'Reciprocal Rank Fusion score calculated across dense and sparse retrievers.',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    sortOrder: {
      control: 'select',
      options: ['asc', 'desc', false],
    },
    sortable: {
      control: 'boolean',
    },
    hint: {
      control: 'text',
    },
  },
} satisfies Meta<VTableColumnHeaderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableComponents = {
  VTable,
  VTableHead,
  VTableBody,
  VTableRow,
  VTableCell,
  VTableColumnHeader,
  VTypography,
};

export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      const activeSort = ref<SortOrder>(args.sortOrder ?? false);
      const handleSort = (order: SortOrder) => {
        activeSort.value = order;
      };
      return { args, activeSort, handleSort };
    },
    template: `
      <VTable>
        <VTableHead>
          <VTableRow>
            <VTableColumnHeader v-bind="args" :sort-order="activeSort" @sort="handleSort">
              RRF Score
            </VTableColumnHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableRow>
            <VTableCell>0.0328</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Interactive Sort States */
export const SortStates: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      const currentSort = ref<SortOrder>('asc');
      const handleSort = (nextOrder: SortOrder) => {
        currentSort.value = nextOrder;
      };
      return { currentSort, handleSort };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Interactive Table Header (Current State: {{ currentSort || 'none' }})
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableColumnHeader>Rank</VTableColumnHeader>
                  <VTableColumnHeader
                    sortable
                    :sort-order="currentSort"
                    hint="Click to toggle sorting sequence (asc -> desc -> default)"
                    @sort="handleSort"
                  >
                    Dense Cosine Score
                  </VTableColumnHeader>
                  <VTableColumnHeader align="end">Provider</VTableColumnHeader>
                </VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow>
                  <VTableCell>#1</VTableCell>
                  <VTableCell>0.892</VTableCell>
                  <VTableCell align="end">OpenAI</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Alignment and Hint Tooltips Variations */
export const FeatureBreakdown: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Full Column Feature Matrix
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableColumnHeader hint="Unique document identification hash code">
                    Document ID
                  </VTableColumnHeader>
                  <VTableColumnHeader
                    align="center"
                    sortable
                    sort-order="desc"
                    hint="Sparse BM25 lexical matching score"
                  >
                    BM25 Rank
                  </VTableColumnHeader>
                  <VTableColumnHeader
                    align="end"
                    sortable
                    sort-order="asc"
                    hint="Combined Reciprocal Rank Fusion output value"
                  >
                    Final Fusion Score
                  </VTableColumnHeader>
                </VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow>
                  <VTableCell>chunk_00491</VTableCell>
                  <VTableCell align="center">12.4</VTableCell>
                  <VTableCell align="end">0.0298</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};
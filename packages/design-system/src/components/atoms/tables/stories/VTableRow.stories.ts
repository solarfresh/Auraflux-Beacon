import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow, { type VTableRowProps } from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Tables/VTableRow',
  component: VTableRow,
  tags: ['autodocs'],
  args: {
    intent: undefined,
    hoverable: true,
    selected: false,
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    hoverable: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
  },
} satisfies Meta<VTableRowProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableComponents = {
  VTable,
  VTableHead,
  VTableBody,
  VTableRow,
  VTableHeader,
  VTableCell,
  VTypography,
};

const sampleRows = [
  { id: 1, query: 'revenue growth 2024', density: 'High', score: 0.942 },
  { id: 2, query: 'supply chain margin', density: 'Medium', score: 0.881 },
  { id: 3, query: 'quarterly guidance', density: 'Low', score: 0.725 },
];

export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      return { args, sampleRows };
    },
    template: `
      <VTable>
        <VTableHead>
          <VTableRow>
            <VTableHeader>Query Term</VTableHeader>
            <VTableHeader>Density</VTableHeader>
            <VTableHeader align="end">Score</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableRow v-bind="args">
            <VTableCell>{{ sampleRows[0].query }}</VTableCell>
            <VTableCell>{{ sampleRows[0].density }}</VTableCell>
            <VTableCell align="end">{{ sampleRows[0].score }}</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Row Selection State */
export const SelectedState: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      return { sampleRows };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="xs">
          <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
            Selected Row (Highlights second row)
          </VTypography>
          <VTable>
            <VTableHead>
              <VTableRow>
                <VTableHeader>ID</VTableHeader>
                <VTableHeader>Query Term</VTableHeader>
                <VTableHeader align="end">Score</VTableHeader>
              </VTableRow>
            </VTableHead>
            <VTableBody>
              <VTableRow
                v-for="row in sampleRows"
                :key="row.id"
                :selected="row.id === 2"
              >
                <VTableCell>{{ row.id }}</VTableCell>
                <VTableCell>{{ row.query }}</VTableCell>
                <VTableCell align="end">{{ row.score }}</VTableCell>
              </VTableRow>
            </VTableBody>
          </VTable>
        </VStack>
      </VBox>
    `,
  }),
};

/** Intent Overrides on Individual Rows */
export const IntentVariants: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="xs">
          <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
            Row-level Intent Overrides
          </VTypography>
          <VTable>
            <VTableHead>
              <VTableRow>
                <VTableHeader>Status</VTableHeader>
                <VTableHeader>Message</VTableHeader>
              </VTableRow>
            </VTableHead>
            <VTableBody>
              <VTableRow intent="success" :selected="true">
                <VTableCell>Success</VTableCell>
                <VTableCell>RRF Fusion Index compiled successfully.</VTableCell>
              </VTableRow>
              <VTableRow intent="warning" :selected="true">
                <VTableCell>Warning</VTableCell>
                <VTableCell>High latency detected during vector retrieval.</VTableCell>
              </VTableRow>
              <VTableRow intent="danger" :selected="true">
                <VTableCell>Danger</VTableCell>
                <VTableCell>Failed to parse document chunk embedding.</VTableCell>
              </VTableRow>
            </VTableBody>
          </VTable>
        </VStack>
      </VBox>
    `,
  }),
};
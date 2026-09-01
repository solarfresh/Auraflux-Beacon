import type { Meta, StoryObj } from '@storybook/vue3';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableBody, { type VTableBodyProps } from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

const meta = {
  title: 'Atoms/Tables/VTableBody',
  component: VTableBody,
  tags: ['autodocs'],
  args: {
    intent: undefined,
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<VTableBodyProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableComponents = {
  VTable,
  VTableHead,
  VTableBody,
  VTableRow,
  VTableHeader,
  VTableCell,
};

const sampleData = [
  { id: 1, name: 'OpenAI Text Embedding 3', dimension: 1536, provider: 'OpenAI' },
  { id: 2, name: 'BAAI BGE-M3', dimension: 1024, provider: 'BAAI' },
  { id: 3, name: 'Cohere Multilingual v3', dimension: 1024, provider: 'Cohere' },
];

export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      return { args, sampleData };
    },
    template: `
      <VTable>
        <VTableHead>
          <VTableRow>
            <VTableHeader>Model</VTableHeader>
            <VTableHeader>Dimensions</VTableHeader>
            <VTableHeader align="end">Provider</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody v-bind="args">
          <VTableRow v-for="item in sampleData" :key="item.id">
            <VTableCell>{{ item.name }}</VTableCell>
            <VTableCell>{{ item.dimension }}</VTableCell>
            <VTableCell align="end">{{ item.provider }}</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Overridden Divide Intent Variants */
export const IntentDivideOverrides: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      return { sampleData };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <div>
            <h4 class="mb-2 font-semibold text-xs text-slate-500 uppercase">Brand Divide Override</h4>
            <VTable>
              <VTableHead>
                <VTableRow><VTableHeader>Model</VTableHeader><VTableHeader>Provider</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody intent="brand">
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.provider }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold text-xs text-slate-500 uppercase">Success Divide Override</h4>
            <VTable>
              <VTableHead>
                <VTableRow><VTableHeader>Model</VTableHeader><VTableHeader>Provider</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody intent="success">
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.provider }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold text-xs text-slate-500 uppercase">Warning Divide Override</h4>
            <VTable>
              <VTableHead>
                <VTableRow><VTableHeader>Model</VTableHeader><VTableHeader>Provider</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody intent="warning">
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.provider }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>
        </VStack>
      </VBox>
    `,
  }),
};
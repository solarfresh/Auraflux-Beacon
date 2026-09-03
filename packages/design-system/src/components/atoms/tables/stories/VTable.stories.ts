import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTable, { type VTableProps } from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Tables/VTable',
  component: VTable,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    intent: 'neutral',
    striped: false,
    hoverable: true,
    bordered: true,
    shadow: false,
    overflowX: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    striped: {
      control: 'boolean',
    },
    hoverable: {
      control: 'boolean',
    },
    bordered: {
      control: 'boolean',
    },
    shadow: {
      control: 'boolean',
    },
    overflowX: {
      control: 'boolean',
    },
  },
} satisfies Meta<VTableProps>;

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
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Developer', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Designer', status: 'Inactive' },
];

export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      return { args, sampleData };
    },
    template: `
      <VTable v-bind="args">
        <VTableHead>
          <VTableRow>
            <VTableHeader>ID</VTableHeader>
            <VTableHeader>Name</VTableHeader>
            <VTableHeader>Email</VTableHeader>
            <VTableHeader>Role</VTableHeader>
            <VTableHeader align="end">Status</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableRow v-for="item in sampleData" :key="item.id">
            <VTableCell>{{ item.id }}</VTableCell>
            <VTableCell>{{ item.name }}</VTableCell>
            <VTableCell>{{ item.email }}</VTableCell>
            <VTableCell>{{ item.role }}</VTableCell>
            <VTableCell align="end">{{ item.status }}</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Intent Variants */
export const IntentVariants: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      return { sampleData };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <div>
            <h4 class="mb-2 font-semibold">Neutral</h4>
            <VTable intent="neutral">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Role</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.role }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold">Brand</h4>
            <VTable intent="brand">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Role</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.role }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold">Success</h4>
            <VTable intent="success">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Role</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.role }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>
        </VStack>
      </VBox>
    `,
  }),
};

/** Table Sizes & Density */
export const Sizes: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      return { sampleData };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <div>
            <h4 class="mb-2 font-semibold">Extra Small (xs)</h4>
            <VTable size="xs">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Email</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.email }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold">Small (sm)</h4>
            <VTable size="sm">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Email</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.email }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold">Medium (md)</h4>
            <VTable size="md">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Email</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.email }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>

          <div>
            <h4 class="mb-2 font-semibold">Large (lg)</h4>
            <VTable size="lg">
              <VTableHead>
                <VTableRow><VTableHeader>Name</VTableHeader><VTableHeader>Email</VTableHeader></VTableRow>
              </VTableHead>
              <VTableBody>
                <VTableRow v-for="item in sampleData" :key="item.id">
                  <VTableCell>{{ item.name }}</VTableCell>
                  <VTableCell>{{ item.email }}</VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </div>
        </VStack>
      </VBox>
    `,
  }),
};

/** Row Selection State */
export const SelectedRow: Story = {
  render: () => ({
    components: { ...tableComponents, VBox },
    setup() {
      return { sampleData };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VTable>
          <VTableHead>
            <VTableRow>
              <VTableHeader>ID</VTableHeader>
              <VTableHeader>Name</VTableHeader>
              <VTableHeader>Role</VTableHeader>
            </VTableRow>
          </VTableHead>
          <VTableBody>
            <VTableRow
              v-for="item in sampleData"
              :key="item.id"
              :selected="item.id === 2"
            >
              <VTableCell>{{ item.id }}</VTableCell>
              <VTableCell>{{ item.name }}</VTableCell>
              <VTableCell>{{ item.role }}</VTableCell>
            </VTableRow>
          </VTableBody>
        </VTable>
      </VBox>
    `,
  }),
};

/** Alignment Showcase */
export const CellAlignment: Story = {
  render: () => ({
    components: { ...tableComponents, VBox },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VTable>
          <VTableHead>
            <VTableRow>
              <VTableHeader align="start">Left Aligned</VTableHeader>
              <VTableHeader align="center">Center Aligned</VTableHeader>
              <VTableHeader align="end">Right Aligned</VTableHeader>
            </VTableRow>
          </VTableHead>
          <VTableBody>
            <VTableRow>
              <VTableCell align="start">Start Content</VTableCell>
              <VTableCell align="center">Center Content</VTableCell>
              <VTableCell align="end">$1,200.00</VTableCell>
            </VTableRow>
          </VTableBody>
        </VTable>
      </VBox>
    `,
  }),
};
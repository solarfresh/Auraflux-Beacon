import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VDataTable, {
  type VDataTableColumn,
} from '@auraflux/design-system/components/organisms/tables/VDataTable.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const mockColumns: VDataTableColumn[] = [
  { key: 'id', label: 'ID', width: '80px', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', align: 'center' },
];

const mockData: UserRow[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index % 3 === 0 ? 'Admin' : index % 2 === 0 ? 'Editor' : 'Viewer',
  status: index % 4 === 0 ? 'pending' : index % 3 === 0 ? 'inactive' : 'active',
}));

const meta: Meta<typeof VDataTable> = {
  title: 'Organisms/Tables/VDataTable',
  component: VDataTable as any,
  tags: ['autodocs'],
  args: {
    columns: mockColumns,
    data: mockData,
    rowKey: 'id',
    intent: 'neutral',
    size: 'sm',
    selectable: true,
    pagination: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    selectable: { control: 'boolean' },
    pagination: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic table setup with row selection via VCheckbox and slot customization
 */
export const Default: Story = {
  render: (args) => ({
    components: { VDataTable, VBox, VBadge, VTypography },
    setup() {
      const selectedKeys = ref<(string | number)[]>([2, 4]);

      const getStatusIntent = (status: UserRow['status']) => {
        switch (status) {
          case 'active':
            return 'success';
          case 'pending':
            return 'warning';
          case 'inactive':
            return 'danger';
          default:
            return 'neutral';
        }
      };

      return { args, selectedKeys, getStatusIntent };
    },
    template: `
      <VBox padding="md" class="space-y-4">
        <VDataTable
          v-bind="args"
          v-model:selectedKeys="selectedKeys"
        >
          <template #cell-status="{ value }">
            <VBadge :intent="getStatusIntent(value)" size="xs">
              {{ value }}
            </VBadge>
          </template>
        </VDataTable>

        <VTypography size="sm" attention="tertiary">
          Selected Row IDs: {{ selectedKeys.join(', ') || 'None' }}
        </VTypography>
      </VBox>
    `,
  }),
};

/**
 * Empty state demonstration when no records match or exist
 */
export const EmptyState: Story = {
  args: {
    columns: mockColumns,
    data: [] as UserRow[],
    emptyTitle: 'No users found',
    emptyDescription: 'Try adjusting your search criteria or adding new entries.',
  },
  render: (args) => ({
    components: { VDataTable, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="md">
        <VDataTable v-bind="args" />
      </VBox>
    `,
  }),
};

/**
 * Non-selectable simple display table without checkboxes
 */
export const Simple: Story = {
  args: {
    columns: mockColumns,
    selectable: false,
    pagination: false,
    data: mockData.slice(0, 5),
  },
  render: (args) => ({
    components: { VDataTable, VBox },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="md">
        <VDataTable v-bind="args" />
      </VBox>
    `,
  }),
};
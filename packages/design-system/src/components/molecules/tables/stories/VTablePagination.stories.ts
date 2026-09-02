import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import VTablePagination, { type VTablePaginationProps } from '@auraflux/design-system/components/molecules/tables/VTablePagination.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

const meta = {
  title: 'Molecules/Tables/VTablePagination',
  component: VTablePagination,
  tags: ['autodocs'],
  args: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 98,
    pageSizeOptions: [10, 20, 50, 100],
    showFirstLastButtons: true,
    disabled: false,
  },
  argTypes: {
    currentPage: { control: 'number' },
    pageSize: { control: 'number' },
    totalItems: { control: 'number' },
    pageSizeOptions: { control: 'object' },
    showFirstLastButtons: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<VTablePaginationProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive default pagination control integrated with VSelect
 */
export const Default: Story = {
  render: (args) => ({
    components: { VTablePagination, VBox },
    setup() {
      const page = ref(args.currentPage ?? 1);
      const size = ref(args.pageSize ?? 10);
      return { args, page, size };
    },
    template: `
      <VBox border="all" rounded="lg" class="w-full">
        <VTablePagination
          v-bind="args"
          v-model:currentPage="page"
          v-model:pageSize="size"
        />
      </VBox>
    `,
  }),
};

/**
 * Large dataset variation with custom page sizes
 */
export const LargeDataset: Story = {
  render: () => ({
    components: { VTablePagination, VBox },
    setup() {
      const page = ref(5);
      const size = ref(20);
      return { page, size };
    },
    template: `
      <VBox border="all" rounded="lg" class="w-full">
        <VTablePagination
          v-model:currentPage="page"
          v-model:pageSize="size"
          :total-items="1250"
          :page-size-options="[10, 20, 50, 100]"
        />
      </VBox>
    `,
  }),
};

/**
 * Disabled state story
 */
export const Disabled: Story = {
  render: () => ({
    components: { VTablePagination, VBox },
    setup() {
      const page = ref(1);
      const size = ref(10);
      return { page, size };
    },
    template: `
      <VBox border="all" rounded="lg" class="w-full">
        <VTablePagination
          v-model:currentPage="page"
          v-model:pageSize="size"
          :total-items="50"
          :disabled="true"
        />
      </VBox>
    `,
  }),
};
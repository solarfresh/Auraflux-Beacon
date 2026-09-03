import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableEmpty, { type VTableEmptyProps } from '@auraflux/design-system/components/molecules/tables/VTableEmpty.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Molecules/Tables/VTableEmpty',
  component: VTableEmpty,
  tags: ['autodocs'],
  args: {
    colspan: 3,
    title: 'No Documents Found',
    description: 'There are no records matching your active query filter criteria.',
  },
  argTypes: {
    colspan: { control: 'number' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<VTableEmptyProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableComponents = {
  VTable,
  VTableHead,
  VTableBody,
  VTableRow,
  VTableHeader,
  VTableEmpty,
  VIcon,
  VButton,
};

/**
 * Default minimal empty state layout
 */
export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      return { args };
    },
    template: `
      <VTable>
        <VTableHead>
          <VTableRow>
            <VTableHeader>Document ID</VTableHeader>
            <VTableHeader>Status</VTableHeader>
            <VTableHeader align="end">Actions</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableEmpty v-bind="args" />
        </VTableBody>
      </VTable>
    `,
  }),
};

/**
 * Empty state variant utilizing icon and action call-to-action slots
 */
export const WithActions: Story = {
  render: () => ({
    components: { ...tableComponents },
    template: `
      <VTable>
        <VTableHead>
          <VTableRow>
            <VTableHeader>Document ID</VTableHeader>
            <VTableHeader>Status</VTableHeader>
            <VTableHeader align="end">Actions</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableEmpty
            :colspan="3"
            title="No Results Matched"
            description="Try adjusting your retrieval parameters or upload a new indexing dataset."
          >
            <template #icon>
              <VIcon name="DocumentMagnifyingGlass" size="lg" class="text-slate-400 mb-1" />
            </template>
            <template #action>
              <VButton size="sm" attention="secondary" icon-name="Plus">
                Add Document
              </VButton>
            </template>
          </VTableEmpty>
        </VTableBody>
      </VTable>
    `,
  }),
};
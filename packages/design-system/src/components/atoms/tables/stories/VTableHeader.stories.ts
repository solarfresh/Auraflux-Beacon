import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader, { type VTableHeaderProps } from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Tables/VTableHeader',
  component: VTableHeader,
  tags: ['autodocs'],
  args: {
    align: 'start',
    size: undefined,
    padding: undefined,
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<VTableHeaderProps>;

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
            <VTableHeader v-bind="args">Header Title</VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableRow>
            <VTableCell>Sample Row Data</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Alignment Variations */
export const Alignments: Story = {
  render: () => ({
    components: { ...tableComponents, VBox },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VTable>
          <VTableHead>
            <VTableRow>
              <VTableHeader align="start">Start (Left)</VTableHeader>
              <VTableHeader align="center">Center</VTableHeader>
              <VTableHeader align="end">End (Right)</VTableHeader>
            </VTableRow>
          </VTableHead>
          <VTableBody>
            <VTableRow>
              <VTableCell align="start">Alpha</VTableCell>
              <VTableCell align="center">Beta</VTableCell>
              <VTableCell align="end">Gamma</VTableCell>
            </VTableRow>
          </VTableBody>
        </VTable>
      </VBox>
    `,
  }),
};

/** Header Sizes Override */
export const Sizes: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Size: Extra Small (xs)
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableHeader size="xs">Column Header</VTableHeader>
                  <VTableHeader size="xs" align="end">Action</VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>

          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Size: Large (lg)
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableHeader size="lg">Column Header</VTableHeader>
                  <VTableHeader size="lg" align="end">Action</VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Explicit Padding Overrides */
export const PaddingOverrides: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Padding None (p-0)
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableHeader padding="none">Zero Padding Header</VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>

          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Padding Extra Large (p-8)
            </VTypography>
            <VTable>
              <VTableHead>
                <VTableRow>
                  <VTableHeader padding="xl">Extra Large Padding Header</VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};
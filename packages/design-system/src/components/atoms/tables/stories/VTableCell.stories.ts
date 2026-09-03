import type { Meta, StoryObj } from '@storybook/vue3';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableHead from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableCell, { type VTableCellProps } from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Atoms/Tables/VTableCell',
  component: VTableCell,
  tags: ['autodocs'],
  args: {
    align: 'start',
    size: undefined,
    padding: undefined,
  },
} satisfies Meta<VTableCellProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const tableComponents = {
  VTable,
  VTableHead,
  VTableBody,
  VTableRow,
  VTableHeader,
  VTableCell,
  VBadge,
  VTypography,
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
              <VTableBody>
                <VTableRow>
                  <VTableCell padding="none">
                    <VTypography size="sm">Compact Edge Cell</VTypography>
                  </VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </VStack>

          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Padding Large (p-6)
            </VTypography>
            <VTable>
              <VTableBody>
                <VTableRow>
                  <VTableCell padding="lg">
                    <VTypography size="sm">Spacious Cell Content</VTypography>
                  </VTableCell>
                </VTableRow>
              </VTableBody>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};

/** Rich Content Inside Cells (RRF Fusion Rank Breakdown) */
export const RichContent: Story = {
  render: () => ({
    components: { ...tableComponents, VBox },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VTable>
          <VTableHead>
            <VTableRow>
              <VTableHeader>Rank</VTableHeader>
              <VTableHeader>Chunk Preview</VTableHeader>
              <VTableHeader align="end">Score</VTableHeader>
            </VTableRow>
          </VTableHead>
          <VTableBody>
            <VTableRow>
              <VTableCell>
                <VBadge intent="success" size="xs">#1</VBadge>
              </VTableCell>
              <VTableCell>
                <VTypography size="xs" surface="outline">
                  ... AI server module growth driven revenue up by 28.4% ...
                </VTypography>
              </VTableCell>
              <VTableCell align="end">
                <VTypography size="xs" weight="bold">
                  0.0292
                </VTypography>
              </VTableCell>
            </VTableRow>
          </VTableBody>
        </VTable>
      </VBox>
    `,
  }),
};
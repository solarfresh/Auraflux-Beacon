import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTable from '@auraflux/design-system/components/atoms/tables/VTable.vue';
import VTableBody from '@auraflux/design-system/components/atoms/tables/VTableBody.vue';
import VTableCell from '@auraflux/design-system/components/atoms/tables/VTableCell.vue';
import VTableHead, { type VTableHeadProps } from '@auraflux/design-system/components/atoms/tables/VTableHead.vue';
import VTableHeader from '@auraflux/design-system/components/atoms/tables/VTableHeader.vue';
import VTableRow from '@auraflux/design-system/components/atoms/tables/VTableRow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Atoms/Tables/VTableHead',
  component: VTableHead,
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
} satisfies Meta<VTableHeadProps>;

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

const sampleHeaders = ['Dense Rank', 'Document ID', 'Cosine Score', 'RRF Fusion Score'];

export const Default: Story = {
  render: (args) => ({
    components: { ...tableComponents },
    setup() {
      return { args, sampleHeaders };
    },
    template: `
      <VTable>
        <VTableHead v-bind="args">
          <VTableRow>
            <VTableHeader v-for="header in sampleHeaders" :key="header">
              {{ header }}
            </VTableHeader>
          </VTableRow>
        </VTableHead>
        <VTableBody>
          <VTableRow>
            <VTableCell>#1</VTableCell>
            <VTableCell>doc_88201</VTableCell>
            <VTableCell>0.924</VTableCell>
            <VTableCell>0.0321</VTableCell>
          </VTableRow>
        </VTableBody>
      </VTable>
    `,
  }),
};

/** Intent Surface Styles Override */
export const IntentVariants: Story = {
  render: () => ({
    components: { ...tableComponents, VBox, VStack },
    setup() {
      return { sampleHeaders };
    },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Brand Head Intent Override
            </VTypography>
            <VTable>
              <VTableHead intent="brand">
                <VTableRow>
                  <VTableHeader v-for="header in sampleHeaders" :key="header">
                    {{ header }}
                  </VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>

          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Success Head Intent Override
            </VTypography>
            <VTable>
              <VTableHead intent="success">
                <VTableRow>
                  <VTableHeader v-for="header in sampleHeaders" :key="header">
                    {{ header }}
                  </VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>

          <VStack gap="xs">
            <VTypography tag="h4" size="xs" weight="semibold" surface="ghost">
              Warning Head Intent Override
            </VTypography>
            <VTable>
              <VTableHead intent="warning">
                <VTableRow>
                  <VTableHeader v-for="header in sampleHeaders" :key="header">
                    {{ header }}
                  </VTableHeader>
                </VTableRow>
              </VTableHead>
            </VTable>
          </VStack>
        </VStack>
      </VBox>
    `,
  }),
};
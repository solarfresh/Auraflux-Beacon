import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VSchemaItem, { type VSchemaItemProps } from '@auraflux/design-system/components/molecules/indicators/VSchemaItem.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta = {
  title: 'Molecules/Indicators/VSchemaItem',
  component: VSchemaItem,
  tags: ['autodocs'],
  args: {
    name: 'triples',
    type: 'Array[Subject, Predicate, Object]',
    badgeText: 'Filter 2 Core Basis',
    badgeIntent: 'warning',
  },
  argTypes: {
    badgeIntent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<VSchemaItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VSchemaItem },
    setup() {
      return { args };
    },
    template: `<VSchemaItem v-bind="args" />`,
  }),
};

/** UI Mockup Specific Examples (Agent Structured Output Schema) */
export const UIMockupExamples: Story = {
  render: () => ({
    components: { VSchemaItem, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-xl">
        <VStack gap="sm">
          <VSchemaItem
            name="triples"
            type="Array[Subject, Predicate, Object]"
            badgeText="Filter 2 Core Basis"
            badgeIntent="warning"
          />
          <VSchemaItem
            name="tags"
            type="Array[String]"
            badgeText="Topic Tags"
            badgeIntent="neutral"
          />
          <VSchemaItem
            name="confidence_score"
            type="Float"
            badgeText="Required"
            badgeIntent="danger"
          />
        </VStack>
      </VBox>
    `,
  }),
};

/** Semantic Intent Variants for Badges */
export const SemanticIntents: Story = {
  render: () => ({
    components: { VSchemaItem, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-xl">
        <VStack gap="sm">
          <VSchemaItem name="neutral_field" type="String" badgeText="Neutral State" badgeIntent="neutral" />
          <VSchemaItem name="brand_field" type="Object" badgeText="Brand Identity" badgeIntent="brand" />
          <VSchemaItem name="success_field" type="Boolean" badgeText="Validated" badgeIntent="success" />
          <VSchemaItem name="warning_field" type="Array[String]" badgeText="Deprecated" badgeIntent="warning" />
          <VSchemaItem name="danger_field" type="Integer" badgeText="Strict Limit" badgeIntent="danger" />
          <VSchemaItem name="info_field" type="String" badgeText="Metadata" badgeIntent="info" />
        </VStack>
      </VBox>
    `,
  }),
};

/** Custom Badge / Action Slot Override */
export const WithCustomSlot: Story = {
  render: () => ({
    components: { VSchemaItem, VBox, VStack, VBadge, VButton },
    template: `
      <VBox border="all" padding="lg" rounded="lg" class="max-w-xl">
        <VStack gap="sm">
          <!-- Multi-badge slot example -->
          <VSchemaItem name="entity_list" type="Array[Entity]">
            <template #badge>
              <div class="flex items-center gap-1.5">
                <VBadge intent="info" size="xs">Indexed</VBadge>
                <VBadge intent="success" size="xs">Active</VBadge>
              </div>
            </template>
          </VSchemaItem>

          <!-- Interactive button slot example -->
          <VSchemaItem name="raw_payload" type="JSON">
            <template #badge>
              <VButton size="xs" attention="tertiary" iconName="Pencil">Edit</VButton>
            </template>
          </VSchemaItem>
        </VStack>
      </VBox>
    `,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import VStack, { type VStackProps } from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Atoms/Layout/VStack',
  component: VStack,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    inline: false,
    fullHeight: false,
    scrollable: false,
  },
} satisfies Meta<VStackProps>;

export default meta;
type Story = StoryObj<typeof VStack>;

/**
 * Default usage: Vertical stack layout with stretched item width.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VStack, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VStack v-bind="args" class="max-w-md">
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography weight="semibold" variant="outline">Section One</VTypography>
        </VBox>
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography weight="semibold" variant="outline">Section Two</VTypography>
        </VBox>
        <VBox padding="md" surface="subtle" rounded="md">
          <VTypography weight="semibold" variant="outline">Section Three</VTypography>
        </VBox>
      </VStack>
    `,
  }),
};

/**
 * Form Layout: Vertical stack pattern commonly used for forms and input fields.
 */
export const FormLayout: Story = {
  args: {
    gap: 'lg',
  },
  render: (args) => ({
    components: { VStack, VBox, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="lg" surface="base" border="all" rounded="lg" class="max-w-md">
        <VStack v-bind="args">
          <VStack gap="xs">
            <VTypography tag="h3" size="lg" weight="bold" variant="outline">
              Account Settings
            </VTypography>
            <VTypography size="sm" variant="ghost">
              Manage your profile preferences and system configurations.
            </VTypography>
          </VStack>

          <VStack gap="sm">
            <VBox padding="md" surface="sunken" rounded="md">
              <VTypography size="sm">Form Field Placeholder A</VTypography>
            </VBox>
            <VBox padding="md" surface="sunken" rounded="md">
              <VTypography size="sm">Form Field Placeholder B</VTypography>
            </VBox>
          </VStack>

          <VButton variant="primary" fullWidth>Save Changes</VButton>
        </VStack>
      </VBox>
    `,
  }),
};

/**
 * Scrollable Container: Enables vertical scrolling when content exceeds container height.
 */
export const ScrollableContent: Story = {
  args: {
    scrollable: true,
    fullHeight: true,
    gap: 'sm',
  },
  render: (args) => ({
    components: { VStack, VBox, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VBox padding="md" border="all" rounded="lg" class="h-64 max-w-sm">
        <VStack v-bind="args">
          <VBox v-for="i in 10" :key="i" padding="sm" surface="subtle" rounded="sm">
            <VTypography size="sm">Scrollable Item #{{ i }}</VTypography>
          </VBox>
        </VStack>
      </VBox>
    `,
  }),
};

/**
 * Centered Content: Vertically and horizontally aligned items.
 */
export const Centered: Story = {
  args: {
    align: 'center',
    justify: 'center',
    gap: 'sm',
  },
  render: (args) => ({
    components: { VStack, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VStack v-bind="args" class="py-8">
        <VTypography tag="h2" size="xl" weight="bold" variant="outline">
          No Data Available
        </VTypography>
        <VTypography size="sm" variant="ghost">
          Get started by creating your first decision model.
        </VTypography>
        <VButton variant="primary" size="sm">Create Model</VButton>
      </VStack>
    `,
  }),
};
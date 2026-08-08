import type { Meta, StoryObj } from '@storybook/vue3';
import VCard, { type VCardProps } from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';

const meta = {
  title: 'Molecules/Resources/VCard',
  component: VCard,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    padding: 'sm',
    gap: 'sm',
    intent: 'neutral',
    surface: "base",
    clickable: false,
    hoverable: true,
  },
} satisfies Meta<VCardProps>;

export default meta;
type Story = StoryObj<typeof VCard>;

/**
 * Default usage: A standard card layout pairing VBox skin and VStack flow layers[cite: 4].
 */
export const Default: Story = {
  render: (args) => ({
    components: { VCard, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <VTypography tag="h4" weight="bold">Card Header</VTypography>
        <VTypography size="sm">This is the main body content inside the VCard molecule.</VTypography>
      </VCard>
    `,
  }),
};

/**
 * Clickable and Hoverable Card: Useful for interactive lists, menus, or navigation items.
 */
export const Interactive: Story = {
  args: {
    clickable: true,
    hoverable: true,
    padding: 'md',
  },
  render: (args) => ({
    components: { VCard, VTypography },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <VTypography tag="h4" weight="bold">Interactive Card</VTypography>
        <VTypography size="sm">Hover over this card to observe the transition effect and shadow elevation.</VTypography>
      </VCard>
    `,
  }),
};

/**
 * Action Card: Combines textual content with interactive buttons or footer controls.
 */
export const WithActions: Story = {
  args: {
    padding: 'md',
    gap: 'md',
  },
  render: (args) => ({
    components: { VCard, VTypography, VButton, VCluster },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <VTypography tag="h4" weight="bold">Project Deployment</VTypography>
        <VTypography size="sm">Ready to push current build artifacts to production environment.</VTypography>
        <VCluster gap="sm" justify="end" class="pt-2">
          <VButton attention="secondary" size="sm">Dismiss</VButton>
          <VButton attention="primary" size="sm">Deploy Now</VButton>
        </VCluster>
      </VCard>
    `,
  }),
};
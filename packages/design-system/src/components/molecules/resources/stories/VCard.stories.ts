import type { Meta, StoryObj } from '@storybook/vue3';
import VCard, { type VCardProps } from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';

const meta = {
  title: 'Molecules/Resources/VCard',
  component: VCard,
  tags: ['autodocs'],
  args: {
    tag: 'div',
    padding: 'sm',
    gap: 'sm',
    surface: 'base',
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
        <VTypography size="sm" variant="tertiary">This is the main body content inside the VCard molecule.</VTypography>
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
        <VTypography size="sm" variant="tertiary">Hover over this card to observe the transition effect and shadow elevation.</VTypography>
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
    components: { VCard, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <VTypography tag="h4" weight="bold">Project Deployment</VTypography>
        <VTypography size="sm" variant="tertiary">Ready to push current build artifacts to production environment.</VTypography>
        <div class="flex gap-2 pt-2">
          <VButton variant="primary" size="sm">Deploy Now</VButton>
          <VButton variant="outline" size="sm">Dismiss</VButton>
        </div>
      </VCard>
    `,
  }),
};
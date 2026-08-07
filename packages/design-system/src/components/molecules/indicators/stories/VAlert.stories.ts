import type { Meta, StoryObj } from '@storybook/vue3';
import VAlert, { type VAlertProps } from '@auraflux/design-system/components/molecules/indicators/VAlert.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

const meta = {
  title: 'Molecules/Indicators/VAlert',
  component: VAlert,
  tags: ['autodocs'],
  args: {
    theme: 'info',
    border: 'all',
    rounded: 'lg',
    padding: 'md',
  },
} satisfies Meta<VAlertProps>;

export default meta;
type Story = StoryObj<typeof VAlert>;

/**
 * Default usage: Standard governance alert with header icon, title, content message, and action buttons.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VAlert, VStack, VTypography, VButton, VIcon },
    setup() {
      return { args };
    },
    template: `
      <VAlert v-bind="args">
        <template #header>
          <VIcon name="InformationCircle" size="sm" />
          <VTypography weight="bold">System Update Available</VTypography>
        </template>
        <VTypography size="sm" theme="tertiary">
          A new governance protocol version 2.4.0 is now available for deployment across your workspace nodes. Please review the changelog before proceeding.
        </VTypography>
        <template #actions>
          <VButton theme="outline" size="sm">Dismiss</VButton>
          <VButton theme="primary" size="sm">Update Now</VButton>
        </template>
      </VAlert>
    `,
  }),
};

/**
 * Warning Theme: Used to highlight cautions or pending compliance actions requiring user attention.
 */
export const Warning: Story = {
  args: {
    theme: 'warning',
  },
  render: (args) => ({
    components: { VAlert, VStack, VTypography, VButton, VIcon },
    setup() {
      return { args };
    },
    template: `
      <VAlert v-bind="args">
        <template #header>
          <VIcon name="ExclamationTriangle" v-bind="args" size="sm" />
          <VTypography weight="bold">Compliance Review Required</VTypography>
        </template>
        <VTypography size="sm" theme="tertiary">
          Your workspace authentication tokens will expire in 3 days. Re-verify your organization credentials to avoid service interruption.
        </VTypography>
        <template #actions>
          <VButton theme="primary" size="sm">Verify Credentials</VButton>
        </template>
      </VAlert>
    `,
  }),
};

/**
 * Long Content Scrollable: Demonstrates the built-in max height and scroll behavior for extensive governance texts.
 */
export const ScrollableContent: Story = {
  args: {
    theme: 'info',
  },
  render: (args) => ({
    components: { VAlert, VStack, VTypography, VButton, VIcon },
    setup() {
      return { args };
    },
    template: `
      <VAlert v-bind="args">
        <template #header>
          <VIcon name="DocumentText" size="sm" />
          <VTypography weight="bold">Terms of Governance & Protocol Rules</VTypography>
        </template>
        <VStack gap="xs">
          <VTypography size="sm" theme="tertiary">1. All automated node deployments must adhere to regional compliance laws.</VTypography>
          <VTypography size="sm" theme="tertiary">2. System administrators are responsible for auditing security logs weekly.</VTypography>
          <VTypography size="sm" theme="tertiary">3. Unauthorized configuration modifications will trigger an automatic rollback.</VTypography>
          <VTypography size="sm" theme="tertiary">4. Data encryption standards must be maintained at AES-256 or higher levels.</VTypography>
          <VTypography size="sm" theme="tertiary">5. Backup intervals should not exceed 24 hours under active production usage.</VTypography>
        </VStack>
        <template #actions>
          <VButton theme="primary" size="sm">I Understand</VButton>
        </template>
      </VAlert>
    `,
  }),
};
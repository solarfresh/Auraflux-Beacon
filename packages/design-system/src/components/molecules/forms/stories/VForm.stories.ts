import type { Meta, StoryObj } from '@storybook/vue3';
import VForm, { type VFormProps } from '@auraflux/design-system/components/molecules/forms/VForm.vue';
import VFormField from '@auraflux/design-system/components/molecules/forms/VFormField.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

const meta = {
  title: 'Molecules/Forms/VForm',
  component: VForm,
  tags: ['autodocs'],
  args: {
    gap: 'md',
  },
} satisfies Meta<VFormProps>;

export default meta;
type Story = StoryObj<typeof VForm>;

/**
 * Default usage: Standard form layout with vertical stacking for multiple form fields and action buttons.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VForm, VFormField, VInput, VButton, VBox },
    setup() {
      return { args };
    },
    template: `
      <VForm v-bind="args" @submit="() => alert('Form submitted!')">
        <VFormField label="Username" required>
          <template #default="{ id, isDisabled }">
            <VInput :id="id" :disabled="isDisabled" placeholder="Enter your username" />
          </template>
        </VFormField>
        <VFormField label="Email Address" required description="We'll never share your email with anyone else.">
          <template #default="{ id, isDisabled }">
            <VInput :id="id" :disabled="isDisabled" type="email" placeholder="name@example.com" />
          </template>
        </VFormField>
        <VBox class="pt-2">
          <VButton variant="primary" type="submit">Submit</VButton>
        </VBox>
      </VForm>
    `,
  }),
};

/**
 * Compact Spacing: Demonstrates tighter vertical rhythm using a smaller gap token.
 */
export const Compact: Story = {
  args: {
    gap: 'sm',
  },
  render: (args) => ({
    components: { VForm, VFormField, VInput, VButton, VBox },
    setup() {
      return { args };
    },
    template: `
      <VForm v-bind="args">
        <VFormField label="First Name">
          <template #default="{ id }">
            <VInput :id="id" placeholder="John" />
          </template>
        </VFormField>
        <VFormField label="Last Name">
          <template #default="{ id }">
            <VInput :id="id" placeholder="Doe" />
          </template>
        </VFormField>
        <VBox class="pt-2">
          <VButton variant="outline" size="sm">Save Changes</VButton>
        </VBox>
      </VForm>
    `,
  }),
};
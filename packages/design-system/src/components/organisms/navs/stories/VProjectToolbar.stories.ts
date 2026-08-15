import type { Meta, StoryObj } from '@storybook/vue3';
import VProjectToolbar, { type ProjectSelectorState } from '@auraflux/design-system/components/organisms/navs/VProjectToolbar.vue';

const defaultState: ProjectSelectorState = {
  filter: 'ALL',
  sorter: 'EDITED',
};

const meta = {
  title: 'Organisms/Navs/VProjectToolbar',
  component: VProjectToolbar,
  tags: ['autodocs'],
  args: {
    modelValue: defaultState,
  },
  argTypes: {
    modelValue: { control: 'object' },
  },
} satisfies Meta<typeof VProjectToolbar>;

export default meta;
type Story = StoryObj<typeof VProjectToolbar>;

/**
 * Default usage: Interactive toolbar bound with double-way binding (v-model).
 */
export const Default: Story = {
  render: (args) => ({
    components: { VProjectToolbar },
    setup() {
      const handleCreate = () => alert('Create New Project clicked');

      return { args, handleCreate };
    },
    template: `
      <VProjectToolbar
        v-model="args.modelValue"
        @create="handleCreate"
      />
    `,
  }),
};

/**
 * Filtered by Active: Shows state with the "Active" filter preset selected.
 */
export const ActiveFilter: Story = {
  args: {
    modelValue: {
      filter: 'LOCKED',
      sorter: 'EDITED',
    },
  },
  render: (args) => ({
    components: { VProjectToolbar },
    setup() {
      return { args };
    },
    template: `<VProjectToolbar v-model="args.modelValue" />`,
  }),
};

/**
 * Sorted by Name: Shows state with sorting preset to "Name".
 */
export const SortedByName: Story = {
  args: {
    modelValue: {
      filter: 'ALL',
      sorter: 'NAME',
    },
  },
  render: (args) => ({
    components: { VProjectToolbar },
    setup() {
      return { args };
    },
    template: `<VProjectToolbar v-model="args.modelValue" />`,
  }),
};
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import VSegmentedControl, { type VSegmentedControlProps } from '@auraflux/design-system/components/molecules/forms/VSegmentedControl.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

const meta = {
  title: 'Molecules/Forms/VSegmentedControl',
  component: VSegmentedControl as any,
  tags: ['autodocs'],
} satisfies Meta<VSegmentedControlProps<any>>;

export default meta;
type Story = StoryObj<typeof VSegmentedControl>;

/**
 * Default interactive example demonstrating two-way v-model binding.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VSegmentedControl, VBox, VTypography },
    setup() {
      const selected = ref('grid');
      const options = [
        { label: 'Grid View', value: 'grid', iconName: 'Squares2X2' },
        { label: 'List View', value: 'list', iconName: 'ListBullet' },
        { label: 'Table View', value: 'table', iconName: 'TableCells' },
      ];
      return { args, selected, options };
    },
    template: `
      <VBox intent="neutral" surface="outline" padding="lg" rounded="xl" class="space-y-4 w-fit">
        <VSegmentedControl
          v-model="selected"
          :options="options"
        />
        <VTypography size="sm" intent="neutral">
          Selected View:
          <VTypography tag="span" size="sm" weight="semibold">
            {{ selected }}
          </VTypography>
        </VTypography>
      </VBox>
    `,
  }),
};

/**
 * Segmented control featuring icons for each tab option.
 */
export const WithIcons: Story = {
  render: (args) => ({
    components: { VSegmentedControl, VBox },
    setup() {
      const activeTab = ref('analytics');
      const options = [
        { label: 'Analytics', value: 'analytics', iconName: 'ChartBar' },
        { label: 'Reports', value: 'reports', iconName: 'DocumentText' },
        { label: 'Settings', value: 'settings', iconName: 'Cog6Tooth' },
      ];
      return { args, activeTab, options };
    },
    template: `
      <VBox intent="neutral" surface="outline" padding="lg" rounded="xl" class="w-fit">
        <VSegmentedControl
          v-model="activeTab"
          :options="options"
        />
      </VBox>
    `,
  }),
};

/**
 * Example showcasing options with a disabled state.
 */
export const WithDisabledState: Story = {
  render: (args) => ({
    components: { VSegmentedControl, VBox },
    setup() {
      const activeState = ref('published');
      const options = [
        { label: 'Published', value: 'published' },
        { label: 'Drafts', value: 'drafts' },
        { label: 'Archived (Locked)', value: 'archived', disabled: true },
      ];
      return { args, activeState, options };
    },
    template: `
      <VBox intent="neutral" surface="outline" padding="lg" rounded="xl" class="w-fit">
        <VSegmentedControl
          v-model="activeState"
          :options="options"
        />
      </VBox>
    `,
  }),
};
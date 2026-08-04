import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import VToolbar from '@auraflux/design-system/components/organisms/layout/VToolbar.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VSegmentedControl from '@auraflux/design-system/components/molecules/forms/VSegmentedControl.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VSelect from '@auraflux/design-system/components/atoms/forms/VSelect.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

type VToolbarProps = InstanceType<typeof VToolbar>['$props'];

/**
 * `VToolbar` is an organism-level layout component that provides a sticky or static
 * navigation container with flexible slot regions (`#start`, `#center`, `#end`).
 */
const meta = {
  title: 'Organisms/Layout/VToolbar',
  component: VToolbar,
  tags: ['autodocs'],
  args: {
    background: 'white',
    border: 'bottom',
    sticky: false, // Set to false by default in Storybook canvas for predictable layout preview
    paddingX: 'md',
    paddingY: 'sm',
  },
} satisfies Meta<VToolbarProps>;

export default meta;
type Story = StoryObj<typeof VToolbar>;

/**
 * Basic Toolbar with simple text title and action buttons using VTypography & VButton.
 */
export const Default: Story = {
  render: (args) => ({
    components: { VToolbar, VTypography, VButton },
    setup() {
      return { args };
    },
    template: `
      <VToolbar v-bind="args">
        <template #start>
          <VTypography tag="h1" size="lg" weight="semibold" color="slate-800">
            Projects
          </VTypography>
        </template>
        <template #end>
          <VButton variant="primary" size="sm">
            Create Project
          </VButton>
        </template>
      </VToolbar>
    `,
  }),
};

/**
 * Complex Toolbar demonstrating integration with `VSegmentedControl`, `VDivider`, `VSelect`, and `VButton`.
 * Represents a standard domain toolbar (e.g., VProjectToolbar).
 */
export const WithSegmentedControlAndDivider: Story = {
  render: (args) => ({
    components: { VToolbar, VSegmentedControl, VDivider, VSelect, VButton },
    setup() {
      const activeFilter = ref('all');
      const sortValue = ref('Recently Edited');
      const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ];
      return { args, activeFilter, sortValue, filterOptions };
    },
    template: `
      <VToolbar v-bind="args">
        <template #start>
          <VSegmentedControl v-model="activeFilter" :options="filterOptions" />
        </template>
        <template #end>
          <div class="flex items-center gap-3">
            <VSelect v-model="sortValue" size="sm" class="w-40">
              <option value="Recently Edited">Recently Edited</option>
              <option value="Date Created">Date Created</option>
            </VSelect>
            <VDivider orientation="vertical" size="sm" />
            <VButton variant="primary" size="sm" icon-name="Plus">
              New Project
            </VButton>
          </div>
        </template>
      </VToolbar>
    `,
  }),
};

/**
 * Complete Layout with all three slots (`#start`, `#center`, `#end`) populated using VTypography and VInput.
 */
export const WithCenterSlot: Story = {
  render: (args) => ({
    components: { VToolbar, VTypography, VInput },
    setup() {
      const searchQuery = ref('');
      return { args, searchQuery };
    },
    template: `
      <VToolbar v-bind="args">
        <template #start>
          <VTypography tag="span" size="sm" weight="medium" color="slate-500">
            Dashboard / Projects
          </VTypography>
        </template>
        <template #center>
          <div class="w-64">
            <VInput
              v-model="searchQuery"
              variant="search"
              size="sm"
              placeholder="Search projects..."
            />
          </div>
        </template>
        <template #end>
          <VTypography tag="span" size="xs" color="slate-400">
            3 projects found
          </VTypography>
        </template>
      </VToolbar>
    `,
  }),
};
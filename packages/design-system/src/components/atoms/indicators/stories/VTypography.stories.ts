import type { Meta, StoryObj } from '@storybook/vue3';
import VTypography, { type VTypographyProps } from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

const meta = {
  title: 'Atoms/Indicators/VTypography',
  component: VTypography,
  tags: ['autodocs'],
  args: {
    tag: 'p',
    size: 'md',
    weight: 'normal',
    border: 'none',
  },
  argTypes: {
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'code', 'blockquote'],
    },
    border: {
      control: 'select',
      options: ['none', 'top', 'bottom', 'left', 'right', 'all'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    weight: {
      control: 'select',
      options: ['thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
    attention: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
    surface: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
    },
  },
} satisfies Meta<VTypographyProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { VTypography },
    setup() {
      return { args };
    },
    template: `<VTypography v-bind="args">The quick brown fox jumps over the lazy dog.</VTypography>`,
  }),
};

/** HTML Tag Elements (Headings & Body Tags) */
export const Tags: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="sm">
          <VTypography tag="h1" size="2xl" weight="bold">h1: Heading Level 1</VTypography>
          <VTypography tag="h2" size="xl" weight="bold">h2: Heading Level 2</VTypography>
          <VTypography tag="h3" size="lg" weight="semibold">h3: Heading Level 3</VTypography>
          <VTypography tag="h4" size="md" weight="semibold">h4: Heading Level 4</VTypography>
          <VTypography tag="p" size="md">p: Paragraph body text describing standard interface content.</VTypography>
          <VTypography tag="span" size="sm" weight="light">span: Inline text block snippet.</VTypography>
          <VTypography tag="code" size="xs">code: const system = 'AuraFlux';</VTypography>
        </VStack>
      </VBox>
    `,
  }),
};

/** Text Sizes (xs ~ 2xl) */
export const Sizes: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="sm">
          <VTypography size="xs">Extra Small (xs)</VTypography>
          <VTypography size="sm">Small (sm)</VTypography>
          <VTypography size="md">Medium (md)</VTypography>
          <VTypography size="lg">Large (lg)</VTypography>
          <VTypography size="xl">Extra Large (xl)</VTypography>
          <VTypography size="2xl">2X Large (2xl)</VTypography>
        </VStack>
      </VBox>
    `,
  }),
};

/** Font Weight Variations */
export const FontWeights: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="sm">
          <VTypography weight="light">Light Weight Text</VTypography>
          <VTypography weight="normal">Normal Weight Text</VTypography>
          <VTypography weight="medium">Medium Weight Text</VTypography>
          <VTypography weight="semibold">Semibold Weight Text</VTypography>
          <VTypography weight="bold">Bold Weight Text</VTypography>
          <VTypography weight="extrabold">Extrabold Weight Text</VTypography>
        </VStack>
      </VBox>
    `,
  }),
};

/** Attention Levels (Primary / Secondary / Tertiary) */
export const Attention: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTypography attention="primary" size="lg" weight="bold">
            Primary Attention - Main Title
          </VTypography>
          <VTypography attention="secondary" size="md">
            Secondary Attention - Supporting body text providing extra details.
          </VTypography>
          <VTypography attention="tertiary" size="sm">
            Tertiary Attention - Caption or muted footnote text.
          </VTypography>
        </VStack>
      </VBox>
    `,
  }),
};

/** Intent Matrix (Semantic Text Status Colors) */
export const Intent: Story = {
  render: () => ({
    components: { VTypography, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VTypography intent="neutral">Neutral Text</VTypography>
          <VTypography intent="brand" weight="medium">Brand Text</VTypography>
          <VTypography intent="success" weight="medium">Success Text</VTypography>
          <VTypography intent="warning" weight="medium">Warning Text</VTypography>
          <VTypography intent="danger" weight="medium">Danger Text</VTypography>
          <VTypography intent="info" weight="medium">Info Text</VTypography>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Surface Variants */
export const Surface: Story = {
  render: () => ({
    components: { VTypography, VBox, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VCluster align="center" gap="md" :wrap="true">
          <VTypography surface="solid" intent="brand">Solid Surface Text</VTypography>
          <VTypography surface="soft" intent="brand">Soft Surface Text</VTypography>
          <VTypography surface="outline" intent="brand">Outline Surface Text</VTypography>
          <VTypography surface="ghost" intent="brand">Ghost Surface Text</VTypography>
        </VCluster>
      </VBox>
    `,
  }),
};

/** Border Accent Variations */
export const Borders: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="md">
          <VTypography border="left" intent="brand" surface="soft" size="lg" weight="bold">
            &nbsp; Quote / Highlight Callout with Left Border Accent
          </VTypography>
          <VTypography border="bottom" tag="h3" intent="neutral" surface="base" size="md" weight="bold">
            Section Title with Bottom Divider Border
          </VTypography>
          <VTypography border="all" intent="neutral" surface="ghost" size="sm">
            Boxed Code snippet or highlighted key term
          </VTypography>
        </VStack>
      </VBox>
    `,
  }),
};

/** Practical Real-World Use Cases */
export const UseCases: Story = {
  render: () => ({
    components: { VTypography, VBox, VStack, VCluster },
    template: `
      <VBox border="all" padding="lg" rounded="lg">
        <VStack gap="lg">
          <!-- Article Title Block -->
          <VStack gap="xs">
            <VTypography tag="h1" size="2xl" weight="bold" intent="brand">
              Design System Release Notes
            </VTypography>
            <VTypography tag="p" attention="secondary" size="sm">
              Published on October 24, 2026 • 5 min read
            </VTypography>
          </VStack>

          <!-- Alert / Status Message -->
          <VBox border="left" intent="warning" surface="soft" padding="md" rounded="none">
            <VStack gap="xs">
              <VTypography intent="warning" weight="bold" size="sm">
                System Maintenance Notice
              </VTypography>
              <VTypography intent="warning" size="xs">
                Scheduled downtime will occur this Sunday from 02:00 UTC to 04:00 UTC.
              </VTypography>
            </VStack>
          </VBox>

          <!-- Metric Stat Card -->
          <VCluster align="baseline" gap="xs">
            <VTypography tag="span" size="2xl" weight="extrabold" intent="success">
              99.98%
            </VTypography>
            <VTypography tag="span" attention="tertiary" size="xs">
              Uptime SLA this month
            </VTypography>
          </VCluster>
        </VStack>
      </VBox>
    `,
  }),
};
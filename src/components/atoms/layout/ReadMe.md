# Atoms: Layout

Layout atoms are the structural primitives of the application. They are responsible for containment, spacing, and alignment. These components replace all raw HTML layout tags (e.g., `div`, `section`, `header`) to ensure design tokens are strictly enforced.

## 🧭 Core Principles

* **No Native Layout Tags**: Use `Box`, `Stack`, and `Cluster` exclusively for structural needs. Never use a bare `div` for layout.
* **Skin vs. Bones**:
* **Skin (`Box`)**: Manages surface properties—Padding, Border, Background, and **Rounding**.
* **Bones (`Stack`, `Cluster`)**: Manages spatial distribution—Vertical and Horizontal gaps.


* **Margin-Free**: Individual components must never have external margins. Spacing is a parent responsibility managed via the `gap` prop.
* **Attribute Flattening**: All layout atoms use `inheritAttrs: false` to ensure custom classes are merged onto the root element without creating redundant DOM depth.

---

## 🛠 Component Catalog

### 1. Box

The universal container. Think of it as the "Physical Shell" of an element.

* **Usage**: Wraps content that needs internal padding, borders, specific backgrounds, or corner rounding.
* **Key Props**:
* `padding`: `none | xs | sm | md | lg | xl`
* `rounded`: `boolean | none | sm | md | lg | xl | full`
* `background`: `white | gray-50 | indigo-50 | amber-50 | transparent`
* `tag`: Semantic HTML element (e.g., `article`, `nav`, `aside`).



### 2. Stack (Vertical)

The vertical rhythm engine. It aligns children in a column.

* **Usage**: Between form fields, list items, or stacked text blocks.
* **Key Props**: `gap`, `align` (horizontal), `justify`.

### 3. Cluster (Horizontal)

The horizontal alignment engine. It aligns children in a row.

* **Usage**: For headers, toolbars, icon+label pairs, and tag clouds.
* **Key Props**: `gap`, `align` (vertical), `justify`, `wrap`.

### 4. Spacer

A utility for creating flexible gaps.

* **Usage**: Use with `flex-1` to push elements to opposite ends within a `Cluster` or `Stack`.

---

## 🎨 Design Tokens

### Spacing Scale

Layout components use a standardized 4px/8px grid system.

| Token | Pixels | Tailwind Utility | Common Use Case |
| --- | --- | --- | --- |
| `none` | 0px | `p-0 / gap-0` | Flush alignment |
| `xs` | 8px | `p-2 / gap-2` | Tight clusters (Icon + Label) |
| `sm` | 12px | `p-3 / gap-3` | List item internals |
| `md` | 16px | `p-4 / gap-4` | Default component spacing |
| `lg` | 24px | `p-6 / gap-6` | Section padding / Panel gutters |
| `xl` | 32px | `p-8 / gap-8` | Page margins |

### Rounding (Corner Radius)

Controlled via the `rounded` prop on the `Box` atom.

| Token | Class | Visual Target |
| --- | --- | --- |
| `true` | `rounded-md` | Standard UI components (8px) |
| `lg` | `rounded-lg` | Cards and main panels (12px) |
| `xl` | `rounded-xl` | Floating icon containers / Modals (16px) |
| `full` | `rounded-full` | Status indicators / Avatars |

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Typed Geometry.** Always use the `rounded="xl"` prop on `Box` for decorative containers. Do not use raw Tailwind classes for radius.
> **Rule 2: Semantic Integrity.** Use the `tag` prop (e.g., `<Box tag="aside">`) to maintain SEO and screen reader compatibility while using the layout engine.
> **Rule 3: Property Cleanliness.** If you find yourself adding `flex` classes to a `Box`, consider if it should be a `Stack` or `Cluster` instead.

### Correct Composition Pattern

```vue
<Box tag="section" padding="lg" background="white" rounded="lg" border="all">
  <Stack gap="md">
    <Cluster justify="between" align="center">
      <Cluster gap="xs">
        <Box padding="xs" background="indigo-50" rounded="xl" class="text-indigo-600">
          <VIcon name="Beaker" size="sm" />
        </Box>
        <VTypography weight="bold">Experiment #42</VTypography
      </Cluster>
      <VBadge variant="emerald">Stable</VBadge>
    </Cluster>

    <VTypography color="gray-600" size="sm">
      Standardized layout ensures that all spacing and shapes are mathematically aligned.
    </VTypography>
  </Stack>
</Box>

```

---

## 📂 Directory Structure

```text
src/components/atoms/layout/
├── Box.vue         # The Skin: Padding, Background, Shape
├── Cluster.vue     # The Bones: Horizontal distribution
├── Spacer.vue      # The Void: Flexible spacing
├── Stack.vue       # The Bones: Vertical distribution
└── README.md       # You are here

```

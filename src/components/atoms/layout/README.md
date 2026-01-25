# Atoms: Layout

Layout atoms are the **architectural primitives** of the application. They enforce structural integrity, consistent spacing, and alignment tokens. Inspired by **Bootstrap's Utility-first grid** and **Material Design's layout principles**, these components replace raw HTML tags to maintain a unified 8px grid.

## 🧭 Core Principles

* **Separation of Concerns (Skin vs. Bones)**:
* **Skin (`VBox`)**: Manages visual surface—Padding, Border, Background, and Rounding.
* **Bones (`VStack`, `VCluster`)**: Manages spatial distribution—Gaps and alignment.


* **Parent-Driven Spacing**: Individual atoms (like Buttons or Icons) **must never** have external margins. All spacing is managed by the parent Layout atom via the `gap` prop.
* **Semantic Rendering**: Use the `tag` prop to ensure accessibility (e.g., `<VBox tag="section">`) without cluttering the DOM.

---

## 🛠 Component Catalog

### 1. VBox (The Container)

The universal "Physical Shell." It implements **Bootstrap's Container** logic with **Material's Elevation**.

* **Props**: `padding`, `rounded`, `background`, `border`, `tag`.
* **Note**: If it doesn't need a background or padding, you might only need a `VStack` or `VCluster`.

### 2. VStack (Vertical)

The vertical rhythm engine. Replaces `.flex-col` patterns.

* **Bootstrap Ref**: Similar to a vertical `flex-column` with `gap` utilities.
* **Props**: `gap`, `align` (items-center, etc.), `justify`.

### 3. VCluster (Horizontal)

The horizontal alignment engine. Replaces `.flex-row` patterns.

* **Bootstrap Ref**: Similar to `.row` but without the negative margin complexity of grids.
* **Props**: `gap`, `align`, `justify`, `wrap`.

### 4. VSpacer

A utility to create dynamic "pushes" (using `flex-grow`).

* **Bootstrap Ref**: Replaces `.me-auto` or `.ms-auto` utilities.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Bare Divs.** Never use a `<div>` for structural grouping. Use `<VStack>` or `<VCluster>`.
> **Rule 2: Geometry Tokens.** For Material-style cards, always use `rounded="lg"` or `rounded="xl"`.
> **Rule 3: Grid vs. Flex.** Use `VCluster` for linear rows (toolbars, tags). For complex 2D grids, consider a dedicated `Organism` or Tailwind's `grid-cols`.

### Correct Implementation Pattern

```vue
<VBox background="white" padding="lg" rounded="xl" border="all shadow-sm">
  <VStack gap="md">
    <VCluster justify="between" align="center">
      <VTypography tag="h3">System Log</VTypography>
      <VSpacer />
      <VButton size="sm" variant="ghost" iconOnly iconName="Settings" />
    </VCluster>

    <VDivider /> <VMarkdown :content="logData" />
  </VStack>
</VBox>

```

---

## 🎨 Design Tokens (Alignment with Bootstrap)

| Token | Pixels | Tailwind Utility | Use Case |
| --- | --- | --- | --- |
| `xs` | 8px | `p-2 / gap-2` | Tight groups (Icon + Text) |
| `sm` | 12px | `p-3 / gap-3` | Small component internals |
| `md` | 16px | `p-4 / gap-4` | **Standard (Bootstrap Default)** |
| `lg` | 24px | `p-6 / gap-6` | Card padding / Section spacing |

---

## 📂 Directory Structure

```text
src/components/atoms/layout/
├── VBox.vue             # The Physical Shell
├── VCluster.vue         # Horizontal Flex
├── VSpacer.vue          # Flex Push
├── VStack.vue           # Vertical Rhythm
└── README.md

```

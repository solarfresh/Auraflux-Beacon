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

* **Props**: `padding`, `rounded`, `background`, `border`, `tag`, `width`, `height`.
* **Constraint**: Must only use predefined `BackgroundToken` values.

### 2. VStack (Vertical)

The vertical rhythm engine. Replaces `.flex-col` patterns.

* **Props**: `gap`, `align`, `justify`.
* **Reference**: Aligns with Bootstrap's vertical `flex-column`.

### 3. VCluster (Horizontal)

The horizontal alignment engine. Replaces `.flex-row` patterns.

* **Props**: `gap`, `align`, `justify`, `wrap`.
* **Reference**: Similar to `.row` but optimized for flexbox distribution.

### 4. VSpacer

A utility to create dynamic "pushes" using `flex-grow`.

---

## 📐 Design Tokens

### Gap & Spacing (`GapSize`)

All spatial distribution must follow the 8px grid system.

| Token | Pixels | Tailwind | Use Case |
| --- | --- | --- | --- |
| `none` | 0px | `gap-0` | Input groups / Unified elements |
| `xs` | 8px | `gap-2` | Tight groups (Icon + Text / Meta info) |
| `sm` | 12px | `gap-3` | Component internals / Sidebar items |
| `md` | 16px | `gap-4` | **Standard (Default)** / Section flow |
| `lg` | 24px | `gap-6` | Card padding / Major layout blocks |
| `xl` | 32px | `gap-8` | Page sections / Large whitespace |

### Surface & Colors (`BackgroundToken`)

To maintain semantic integrity, only the following tokens are permitted:

| Token | Usage |
| --- | --- |
| `white` | Primary surfaces, Headers, Cards |
| `slate-50` | Background of scroll areas, Secondary panels |
| `indigo-50` | Primary action highlights, User message bubbles |
| `amber-50` | AI-generated content areas, Warning states |
| `rose-50` | Error feedback, Destructive action areas |
| `emerald-50` | Success feedback, Verified data areas |
| `transparent` | Nested containers with no visual skin |

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Bare Divs.** Never use a `<div>` for structural grouping or spacing. Use `<VStack>` or `<VCluster>`.
> **Rule 2: Token Discipline.** Strictly use `GapSize` and `BackgroundToken`. Custom hex codes or arbitrary Tailwind `bg-*` classes are prohibited.
> **Rule 3: Geometric Consistency.** For Material-style cards, use `rounded="lg"` or `xl`. Layouts should always be responsive (e.g., `w-full h-full`).
> **Rule 4: Zero Margin Bleed.** Ensure all spacing is handled via the `gap` prop of the parent.

### Correct Implementation Pattern

```vue
<VBox background="white" padding="lg" rounded="xl" border="all shadow-sm">
  <VStack gap="md">
    <VCluster justify="between" align="center">
      <VTypography tag="h3">System Log</VTypography>
      <VSpacer />
      <VButton size="xs" variant="ghost" iconOnly iconName="Settings" />
    </VCluster>

    <VBox background="slate-50" padding="sm" rounded="md">
      <VMarkdown :content="logData" />
    </VBox>
  </VStack>
</VBox>

```

---

## 📂 Directory Structure

```text
src/components/atoms/layout/
├── VBox.vue             # The Physical Shell (Skin)
├── VCluster.vue         # Horizontal Flex (Bones)
├── VSpacer.vue          # Flex Push (Utility)
├── VStack.vue           # Vertical Rhythm (Bones)
└── README.md            # You are here

```
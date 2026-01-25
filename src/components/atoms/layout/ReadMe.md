# Atoms: Layout

Layout atoms are the structural "bones" and "skin" of the application. They are responsible for spacing, containment, and alignment. By using these components, we ensure that the design system's spacing tokens are enforced and that business logic components remain layout-agnostic.

## 🧭 Core Principles

* **No Native Layout Tags**: Use `Box`, `Stack`, and `Cluster` instead of `<div>`, `<header>`, `<section>`, etc.
* **Margin-Free Components**: Individual atoms and molecules should not have external margins. Spacing is always managed by the parent Layout atom.
* **Semantic Structure**: Use the `tag` prop to maintain HTML5 accessibility (e.g., `<Box tag="aside">`) while keeping design system control.

---

## 🛠 Component Catalog

### 1. Box

The foundational container. Handles internal padding, backgrounds, and borders.

* **Usage**: Use as the outer shell for any section or panel.
* **Key Props**: `padding`, `background`, `border`, `shadow`, `tag`.

### 2. Stack

A vertical layout engine (Flex-column).

* **Usage**: Use for stacking elements like form fields, list items, or paragraphs.
* **Key Props**: `gap`, `align` (horizontal), `justify` (vertical).

### 3. Cluster

A horizontal layout engine (Flex-row).

* **Usage**: Use for toolbars, navigation links, or aligning icons with text.
* **Key Props**: `gap`, `align` (vertical), `justify` (horizontal), `wrap`.

### 4. Spacer

A utility for flexible growth or fixed gaps.

* **Usage**: Use with `flex` to push elements to opposite sides of a container.
* **Key Props**: `size`, `flex`, `axis`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: The "Skin & Bones" Pattern.** A common pattern is a `Box` (skin) wrapping a `Stack` or `Cluster` (bones).
> **Rule 2: Avoid Pixel Pushing.** Never use arbitrary Tailwind classes like `mt-[17px]`. Only use the provided `xs`, `sm`, `md`, `lg`, `xl` tokens within Layout atoms.
> **Rule 3: Truncation Context.** When using `Cluster` with text that might overflow, ensure the text container has `min-w-0` to allow the `truncate` utility to function correctly.

### Correct Composition Pattern

```vue
<Box tag="header" padding="sidebar-header" border="bottom">
  <Cluster justify="between">
    <Cluster gap="sm">
      <Icon name="Beaker" />
      <Text weight="bold">Research Lab</Text>
    </Cluster>
    <Button variant="ghost" size="xs" iconOnly iconName="XMark" />
  </Cluster>
</Box>

<Stack fullHeight>
  <Box>Top Content</Box>
  <Spacer flex />
  <Box padding="md" background="gray-50">
    <Button variant="primary" fullWidth>Finish</Button>
  </Box>
</Stack>

```

---

## 🎨 Spacing Tokens (Shared)

| Token | Pixels | Tailwind Class | Usage Context |
| --- | --- | --- | --- |
| `xs` | 4px | `gap-1 / p-1` | Tight clusters, small icons |
| `sm` | 8px | `gap-2 / p-2` | List item internals |
| `md` | 16px | `gap-4 / p-4` | Standard component spacing |
| `lg` | 24px | `gap-6 / p-6` | Section margins |
| `xl` | 32px | `gap-8 / p-8` | Large page gutters |

---

## 📂 Directory Structure

```text
src/components/atoms/layout/
├── Box.vue         # Containment & Surface
├── Cluster.vue     # Horizontal distribution
├── Spacer.vue      # Flexible/Fixed spacing
├── Stack.vue       # Vertical distribution
└── README.md       # You are here

```

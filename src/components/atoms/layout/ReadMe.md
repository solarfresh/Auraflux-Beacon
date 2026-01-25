# Atoms: Layout

Layout atoms are the structural primitives of the application. They are responsible for containment, spacing, and alignment. These components replace all raw HTML layout tags (e.g., `div`, `section`, `header`) to ensure design tokens are strictly enforced.

## 🧭 Core Principles

* **No Native Layout Tags**: Use `Box`, `Stack`, and `Cluster` exclusively for structural needs.
* **Attribute Inheritance**: All layout atoms are configured with `inheritAttrs: false` (or managed via `$attrs`) to allow seamless merging of external classes without manual computed logic.
* **Margin-Free**: Individual components should never have external margins. Spacing is always managed by the parent `Stack` or `Cluster` using the `gap` prop.
* **Skin vs. Bones**:
* **Skin (`Box`)**: Handles the surface properties (Padding, Border, Background).
* **Bones (`Stack`, `Cluster`)**: Handles the distribution of children (Vertical/Horizontal gaps).



---

## 🛠 Component Catalog

### 1. Box

The universal container. Use it as the "Skin" of your UI.

* **Usage**: Wraps content that needs internal padding, borders, or specific backgrounds.
* **Key Props**: `padding`, `background`, `border`, `tag` (semantic HTML).

### 2. Stack

Vertical layout engine (Flex-column).

* **Usage**: Used for vertical rhythm between items (e.g., list items, form fields).
* **Key Props**: `gap`, `align` (horizontal alignment), `justify`.

### 3. Cluster

Horizontal layout engine (Flex-row).

* **Usage**: Used for aligning elements side-by-side (e.g., header actions, icon + text).
* **Key Props**: `gap`, `align` (vertical alignment), `justify`, `wrap`.

### 4. Spacer

The "Push" utility.

* **Usage**: Use with the `flex` prop to push elements to opposite sides of a container or create fixed gaps.
* **Key Props**: `size`, `flex`, `axis`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Semantic Over Style.** Always use the `tag` prop on `Box` to render proper HTML5 elements (`header`, `footer`, `aside`) while maintaining design system styles.
> **Rule 2: Gap Over Margin.** Never use `mt-4` or `mb-2`. Wrap the items in a `Stack` and use `gap="md"`.
> **Rule 3: Class Merging.** Since layout atoms support attribute inheritance, you can pass custom classes directly. The component will handle the merging logic internally.

### Correct Composition Pattern

```vue
<Box tag="aside" padding="md" background="white" border="right">
  <Stack gap="lg">
    <Text size="xl" weight="bold">Navigation</Text>

    <Cluster gap="sm">
      <Icon name="Home" />
      <Text>Dashboard</Text>
    </Cluster>
  </Stack>
</Box>

```

---

## 🎨 Spacing Tokens

Layout components use a standardized spacing scale to ensure vertical and horizontal rhythm.

| Token | Pixels | Tailwind Utility | Context |
| --- | --- | --- | --- |
| `none` | 0px | `p-0 / gap-0` | Flush alignment |
| `xs` | 4px | `p-1 / gap-1` | Tight clusters (e.g., Icon + Label) |
| `sm` | 8px | `p-2 / gap-2` | List item internals |
| `md` | 16px | `p-4 / gap-4` | Default component spacing |
| `lg` | 24px | `p-6 / gap-6` | Section padding / Large gaps |
| `xl` | 32px | `p-8 / gap-8` | Page gutters |

---

## 📂 Directory Structure

```text
src/components/atoms/layout/
├── Box.vue         # Containment, Padding & Background
├── Cluster.vue     # Horizontal spacing & alignment
├── Spacer.vue      # Flexible/Fixed spacing gaps
├── Stack.vue       # Vertical spacing & alignment
└── README.md       # You are here

```

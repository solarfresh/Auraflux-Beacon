# Atoms: The Design System Foundation

Atoms are the smallest functional units of our UI—the "periodic table" of the application. They are purely presentational, layout-agnostic, and managed entirely via props.

## 🧭 Core Principles for AI & Humans

* **Zero Business Logic:** Atoms do not fetch data or hold application state.
* **Semantic Integrity:** Visual style is decoupled from HTML tags (e.g., using `Text.vue` to render an `h1` style as a `p` tag for accessibility).
* **Consistent Tokens:**
* **Focus Ring:** `indigo-500` with `ring-offset-2`.
* **Border Radius:** `rounded-md` (Standard) or `rounded-full` (Badge/Search/Pills).
* **Disabled State:** `opacity-50 cursor-not-allowed` with grayed-out backgrounds.



---

## 🛠 Component Catalog

### 1. Action & Interaction

| Component | Key Props | AI Usage Note |
| --- | --- | --- |
| **Button** | `variant`, `size`, `iconOnly`, `iconName` | **Updated:** Supports `xs` to `lg`. Use `iconOnly` for square buttons; the Atom handles internal Icon sizing. |
| **Checkbox** | `v-model`, `label`, `disabled` | Controlled boolean input. **Updated:** Now supports an optional label for streamlined form building. |

### 2. Form Inputs (Unified Styles)

| Component | Key Props | Description |
| --- | --- | --- |
| **Input** | `variant`, `size`, `type` | Supports `default` and `search` (rounded-full) variants. |
| **Textarea** | `rows`, `size`, `disabled` | Multi-line input. Shared padding and rounding tokens with `Input`. |
| **Select** | `modelValue`, `size` | Native wrapper with custom styling. Use `<slot>` for options. |

### 3. Visual & Content

| Component | Key Props | Description |
| --- | --- | --- |
| **Icon** | `name`, `type`, `size` | Dynamic Heroicons wrapper. Use **PascalCase** names (e.g., `XMark`, `PencilSquare`). |
| **Text** | `tag`, `size`, `weight`, `color` | The typography engine. Supports responsive sizes and semantic coloring. |
| **Badge** | `variant`, `size` | Status and category labels. Use `rounded-full` for pill-style indicators. |
| **MarkdownRenderer** | `content` | Renders safe HTML from Markdown strings using `markdown-it`. |
| **BarSegment** | `width`, `color` | A single progress unit. Clamped (0-100) width with dynamic color themes. |

---

## 🤖 AI Instruction Context (System Prompt)

> [!IMPORTANT]
> **Rule 1:** NEVER use raw HTML tags (e.g., `<button>`, `<input>`, `<h1>`, `<span>`). Always use the corresponding Atom.
> **Rule 2:** Use the `xs` size for actions inside compact list items (e.g., `ResourceListItem`, `KeywordListItem`) to maintain high information density.
> **Rule 3:** **Icon Naming:** Always use PascalCase for icon names to match Heroicons' internal exports and prevent runtime errors.

### Common Implementation Snippets

```vue
<Button variant="primary" size="md">Submit</Button>

<Button variant="ghost" size="xs" iconOnly iconName="Trash" />

<Badge variant="amber" size="xs">Under Review</Badge>

<Text tag="h2" size="lg" weight="bold" color="gray-900">
  Project Summary
</Text>

```

---

## 📂 Directory Structure

```text
src/components/atoms/
├── Badge.vue            # New: Semantic status labels
├── BarSegment.vue
├── Button.vue           # Supports sizes [xs, sm, md, lg]
├── Checkbox.vue
├── Icon.vue             # Use PascalCase for 'name' prop
├── Input.vue
├── MarkdownRenderer.vue
├── Select.vue
├── Text.vue
├── Textarea.vue
└── README.md            # You are here

```

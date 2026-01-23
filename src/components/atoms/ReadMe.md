# Atoms: The Design System Foundation

Atoms are the smallest functional units of our UI—the "periodic table" of the application. They are purely presentational, layout-agnostic, and managed entirely via props.

## 🧭 Core Principles for AI & Humans

* **Zero Business Logic:** Atoms do not fetch data or hold application state.
* **Semantic Integrity:** Visual style is decoupled from HTML tags (e.g., using `Text.vue` to render an `h1` style as a `p` tag for SEO).
* **Consistent Tokens:** * **Focus Ring:** `indigo-600`
* **Border Radius:** `rounded-md` (Standard) or `rounded-full` (Search/Pill)
* **Disabled State:** `bg-gray-50 text-gray-400 border-gray-200`



---

## 🛠 Component Catalog

### 1. Action & Interaction

| Component | Key Props | AI Usage Note |
| --- | --- | --- |
| **Button** | `variant`, `size`, `iconOnly`, `iconName` | Includes `IconButton` logic. Use `iconOnly` for square icon buttons. |
| **Checkbox** | `v-model`, `disabled` | Controlled boolean input. No label included. |

### 2. Form Inputs (Unified Styles)

| Component | Key Props | Description |
| --- | --- | --- |
| **Input** | `variant`, `size`, `type` | Supports `default` and `search` (rounded) variants. |
| **Textarea** | `rows`, `size`, `disabled` | Multi-line input. Shared padding/rounding with `Input`. |
| **Select** | `modelValue`, `size` | Native wrapper. Use `<slot>` for options. |

### 3. Visual & Content

| Component | Key Props | Description |
| --- | --- | --- |
| **Icon** | `name`, `variant`, `size` | Dynamic Heroicons wrapper. Use kebab-case names. |
| **Text** | `tag`, `size`, `weight` | Typography engine for all UI text strings. |
| **MarkdownRenderer** | `content` | Renders Markdown to HTML using `markdown-it`. |
| **BarSegment** | `width`, `color` | Clamped (0-100) building block for progress bars. |

---

## 🤖 AI Instruction Context (System Prompt)

> [!IMPORTANT]
> **Rule 1:** NEVER use raw HTML tags (e.g., `<button>`, `<input>`, `<h1>`). Always use the Atom component.
> **Rule 2:** `IconButton.vue` is **DEPRECATED**. Use `<Button iconOnly />`.
> **Rule 3:** Maintain vertical alignment. All form atoms (`Input`, `Select`, `Textarea`) share the same `size` scale.

### Common Implementation Snippets

```vue
<Button variant="primary">Submit</Button>

<Input variant="search" placeholder="Search..." iconName="magnifying-glass" />

<Text tag="span" size="sm" color="gray-500">Required field</Text>

<Button iconOnly variant="ghost" iconName="trash" />

```

---

## 📂 Directory Structure

```text
src/components/atoms/
├── BarSegment.vue
├── Button.vue           <-- (Integrated IconButton logic)
├── Checkbox.vue
├── Icon.vue
├── Input.vue
├── MarkdownRenderer.vue
├── Select.vue
├── Text.vue
└── Textarea.vue

```

# Atoms: Forms

Form atoms are the primary data-entry components. They wrap native input elements to provide consistent styling, focus management, and unified feedback for validation states.

## 🧭 Core Principles

* **State Synchronization**: All form atoms must support `v-model` for seamless integration with Vue 3's composition API.
* **Accessibility (A11y)**: Every input must be associated with a label (either internally or via `aria-label`) and support standard keyboard navigation.
* **Unified Sizing**: Form elements align with the system-wide size tokens (`sm`, `md`, `lg`) to ensure vertical rhythm when paired with `Actions` (e.g., a search input next to a submit button).
* **Feedback Integration**: Form atoms provide visual hooks for `error` or `success` states, typically driven by parent `Molecules`.

---

## 🛠 Component Catalog

### 1. Input

The standard text entry field. Supports `text`, `password`, `email`, and `number`.

* **Variants**:
* `default`: Standard rectangular rounded field.
* `search`: Pill-shaped (`rounded-full`) specifically for search bars.


* **Props**: `type`, `placeholder`, `size`, `disabled`, `error`.

### 2. Checkbox

A controlled toggle for boolean values.

* **Props**: `modelValue`, `label`, `disabled`.
* **Note**: It includes an internal `Text` atom for its label to ensure typography consistency.

### 3. Select

A styled wrapper for the native dropdown.

* **Usage**: Uses a `<slot>` for `<option>` tags to maintain native performance and accessibility.
* **Props**: `modelValue`, `size`, `disabled`.

### 4. Textarea

Multi-line text input for long-form research notes or AI prompts.

* **Props**: `rows`, `resize` (defaulting to `none` or `vertical`), `size`, `error`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Raw Inputs.** Never use `<input>`, `<textarea>`, or `<select>`. This ensures the `indigo-500` focus ring and `rounded-md` corners are applied globally.
> **Rule 2: Matching Scales.** Always match the `size` of an `Input` with its sibling `Button` (e.g., both should be `lg` in a `MessageInput` molecule).
> **Rule 3: Labeling.** If a form atom is used without a visible label (e.g., a search bar), the `placeholder` prop must be descriptive, or an `aria-label` must be passed.

### Correct Implementation Pattern

```vue
<Input
  v-model="searchQuery"
  variant="search"
  size="md"
  placeholder="Search research papers..."
/>

<Textarea
  v-model="notes"
  :error="!!errorMessage"
  placeholder="Enter findings..."
/>
<Text v-if="errorMessage" color="red-500" size="xs">
  {{ errorMessage }}
</Text>

<Checkbox
  v-model="isAgreed"
  label="I verify this source is grounded."
/>

```

---

## 🎨 Design Tokens

| Property | Value | Tailwind Class |
| --- | --- | --- |
| **Focus State** | Indigo 500 | `focus:border-indigo-500 focus:ring-indigo-500` |
| **Error State** | Red 500 | `border-red-500 text-red-900 placeholder-red-300` |
| **Disabled State** | Gray 50 | `bg-gray-50 cursor-not-allowed opacity-60` |
| **Height (md)** | 40px | `h-10` (Standard for most forms) |

---

## 📂 Directory Structure

```text
src/components/atoms/forms/
├── Checkbox.vue
├── Input.vue
├── Select.vue
├── Textarea.vue
└── README.md          # You are here

```

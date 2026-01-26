# Atoms: Forms

Form atoms are the primary data-entry components. They wrap native HTML input elements to provide consistent styling, focus management, and unified feedback for validation states, aligning with **Bootstrap's Form-Control** patterns and **Material Design's interaction states**.

## 🧭 Core Principles

* **State Synchronization**: All form atoms must support `v-model` (Vue 3 `modelValue`) for seamless integration.
* **Semantic Feedback**: Use system tokens for `error`, `success`, and `warning` states. These should visually align with **Indicators** (e.g., Error state uses the same Red-500 as `VBadge`).
* **Material Interaction**: Every input must feature a distinct **Focus State** (Material-inspired indigo ring) to provide clear user affordance.
* **Unified Sizing (Bootstrap Scale)**: Form elements must support `sm`, `md`, and `lg` sizes to maintain a consistent vertical rhythm across the UI.

---

## 🛠 Component Catalog

### 1. VInput

The universal text entry field.

* **Bootstrap Mapping**: Replaces `.form-control`.
* **Variants**:
* `default`: Rectangular with standard rounding.
* `filled`: Material-style background (slate-50) with a bottom-border emphasis.


* **Props**: `type`, `size`, `error` (boolean), `loading`.

### 2. VCheckbox & VRadio

Controlled toggles for selection.

* **Bootstrap Mapping**: Replaces `.form-check-input`.
* **Logic**: Internally uses `VTypography` for labels to ensure font-size consistency with the input size.

### 3. VSelect

A styled wrapper for the native dropdown.

* **Bootstrap Mapping**: Replaces `.form-select`.
* **Key Feature**: Custom arrow icon using `VIcon` that rotates or changes color on focus.

### 4. VTextarea

Multi-line text input for long-form content.

* **Note**: Supports auto-resize or fixed `rows` prop.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: V-Prefix Only.** Never use native `<input>`. Use `<VInput />` to ensure the `indigo-500` ring-offset and `rounded-md` corners are applied.
> **Rule 2: State Coupling.** When `error` is true, the component must automatically switch border and focus-ring colors to `red-500`.
> **Rule 3: Labeling Strategy.** While `Atoms` handle the input, they should be wrapped by a `VFormField` (Molecule) to include floating labels or helper texts.

### Correct Implementation Pattern

```vue
<VInput
  v-model="username"
  placeholder="Enter username"
  size="md"
/>

<VTextarea
  v-model="biography"
  :error="true"
  placeholder="Tell us about yourself..."
/>

<VCheckbox
  v-model="isAgreed"
  label="I accept the terms and conditions"
/>

```

---

## 🎨 Design Tokens (Tailwind + Material)

| Property | Value | Tailwind Class | Bootstrap Ref |
| --- | --- | --- | --- |
| **Focus Ring** | Indigo 500 | `ring-2 ring-indigo-500 ring-offset-2` | `:focus` |
| **Error Border** | Red 500 | `border-red-500 focus:ring-red-500` | `.is-invalid` |
| **Disabled** | Gray 100 | `bg-gray-100 cursor-not-allowed` | `disabled` |
| **Height (sm)** | 32px | `h-8` | `.form-control-sm` |
| **Height (md)** | 40px | `h-10` | Default |
| **Height (lg)** | 48px | `h-12` | `.form-control-lg` |

---

## 📂 Directory Structure

我們將所有的表單原子收納於 `forms/` 資料夾下，這符合 Bootstrap 將所有 Input 視為同一家族的邏輯。

```text
src/components/atoms/forms/
├── VCheckbox.vue        # Boolean selection
├── VInput.vue           # Text/Email/Password/Search
├── VRadio.vue           # Single choice selection
├── VSelect.vue          # Dropdown selection
├── VTextarea.vue        # Multi-line text
└── README.md            # You are here

```

# Molecules: Forms

Form molecules are functional clusters designed to capture user input and manage validation states. In the **Bootstrap-inspired** architecture, these components represent **Input Groups** and **Form Layouts**, ensuring that labels, inputs, and feedback work as a synchronized unit.

## 🧭 Design Principles

* **Atomic Composition**: Molecules must never use raw HTML tags or utility-first classes for their primary structure. They must be built using `Atoms` (e.g., `VStack`, `VCluster`, `VTypography`).
* **Scale Integrity**: Maintain a 1:1 scale ratio between sibling atoms. For example, a `size="lg"` input must always be paired with a `size="lg"` button.
* **State Propagation**: The molecule is the "Source of Truth." If the parent molecule is in an `error` or `disabled` state, that state must be passed down to all nested atoms.
* **A11y (Accessibility)**: Molecules are responsible for the connection between labels and inputs (e.g., linking `for` and `id` attributes).

---

## 🛠 Component Catalog

### 1. VFormField

The structural wrapper for any input field. It binds labels, inputs, and validation messages.

* **Composition**: `VStack` > [`VCluster` (Label/Hint), `Slot` (Input), `VTypography` (Error)].
* **Bootstrap Ref**: Equivalent to `.mb-3` or `.form-group`.

### 2. VInputGroup

A composite field for side-by-side interactions (e.g., search bars with buttons).

* **Composition**: `VCluster` > [`VInput`, `VButton`].
* **Bootstrap Ref**: Equivalent to `.input-group`.

### 3. VButtonToolbar

A persistent container for workflow actions, typically found in footers or headers.

* **Composition**: `VBox` > `VCluster` > [`VButton` (Cancel), `VButton` (Primary)].
* **Bootstrap Ref**: Equivalent to `.btn-toolbar`.

### 4. VAuthAction

A state-aware trigger for session management that combines identity display and action.

* **Composition**: `VCluster` > [`VAvatar`, `VButton`].

#### 5. VForm (The Logical Wrapper)

The semantic and behavioral engine for user submissions. It replaces raw `<form>` tags to enforce vertical rhythm and submission management.

* **Composition**: `Native Form` > `VStack`.
* **Responsibility**: Handles `@submit.prevent`, manages global loading/disabled states for nested fields, and enforces standardized spacing via `gap`.
* **Key Props**: `gap` (defaulting to `md`).

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Magic Spacing.** Replace all `space-x-*` or `gap-*` Tailwind classes with the `gap` prop on `VStack` or `VCluster`.
> **Rule 2: Attribute Flattening.** Use `inheritAttrs: false` to ensure layout classes (like `flex-1`) are applied to the root layout atom of the molecule.
> **Rule 3: Slot Identification.** `VFormField` should provide a scoped ID to its slot to ensure accessibility without manual ID management.

### Standard Implementation Pattern

```vue
<VCluster gap="none" v-bind="$attrs">
  <VInput
    v-model="query"
    placeholder="Search..."
    class="rounded-r-none border-r-0"
  />
  <VButton
    variant="primary"
    class="rounded-l-none"
    @click="onSearch"
  >
    <VIcon name="Search" />
  </VButton>
</VCluster>

```

---

## 🎨 Layout Tokens (Molecule Specific)

| Relationship | Logic | Token |
| --- | --- | --- |
| **Field to Field** | Vertical flow within `VForm` | `gap="md"` (16px) |
| **Label to Input** | Immediate association | `gap="xs"` (8px) |
| **Input to Error** | Feedback proximity | `gap="1"` (4px) |
| **Button to Button** | Independent actions | `gap="md"` (16px) |
| **Input Group** | Unified component | `gap="none"` (0px) |

---

## 📂 Directory Structure

```text
src/components/molecules/forms/
├── VButtonToolbar.vue      # Action clusters
├── VForm.vue               # Semantic form & layout engine (New)
├── VFormField.vue          # Label + Input wrapper
├── VInputGroup.vue         # Combined input/button (Search)
├── VAuthAction.vue         # Identity + Session trigger
└── README.md               # You are here

```

# Molecules Layer

Molecules are groups of **Atoms** bonded together to form the smallest functional units of the UI. Following the **Bootstrap** categorization model, these components handle specific user tasks like capturing form data, displaying complex status, or managing navigation groups.

## 🏗 The Architecture

To maintain a flat and predictable structure, all molecules are categorized into four core families that mirror the Atoms layer.

### 1. 📝 [Forms](forms/README.md) (Input Groups)

Complex input patterns that combine labels, inputs, and actions.

* **Key Components:** `VFormField`, `VInputGroup`, `VButtonToolbar`.
* **Focus:** Accessibility (A11y), validation feedback, and input synchronization.

### 2. 📢 [Indicators](indicators/README.md) (Feedback & Overlays)

Composite components that communicate status or manage contextual focus.

* **Key Components:** `VModal`, `VStatusCard`, `VOverlayLoader`, `VStepProgress`.
* **Focus:** Material elevation, backdrop management, and semantic signaling.

### 3. 🧭 [Navs](navs/README.md) (Navigation & Lists)

Structural clusters used for moving through the application's architecture.

* **Key Components:** `VNavGroup`, `VNavTabs`, `VNavListItem`, `VNavAlert`.
* **Focus:** Hierarchical depth, active state management, and responsive truncation.

### 4. 🔘 Buttons (Action Groups)

*(Note: Most button clusters are handled via `VButtonToolbar` in the Forms or Navs category to minimize depth.)*

---

## 🧭 Global Molecule Principles

### 1. Composition over CSS

Molecules **must** be built using layout atoms (`VBox`, `VStack`, `VCluster`). Never use raw Flexbox or Grid classes inside a molecule if a layout atom can achieve the same result.

* **Wrong:** `<div class="flex gap-4">...</div>`
* **Right:** `<VCluster gap="md">...</VCluster>`

### 2. Source of Truth

The molecule is responsible for synchronized state. If an input is `disabled`, the molecule must propagate that state to its child buttons and labels.

### 3. Slot Flexibility

To prevent "Prop Drilling," molecules should use **Slots** for their core content (especially `VFormField` and `VNavGroup`). This allows atoms to be swapped easily without changing the molecule's logic.

### 4. Attribute Inheritance

Always use `inheritAttrs: false` in the component script and bind `$attrs` to the root layout atom. This ensures that parent-injected spacing (like `flex-1`) is applied correctly to the outer container.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Atomic Integrity.** A molecule must be composed of 2 or more Atoms. If it only contains 1 Atom, it should remain in the Atoms layer.
> **Rule 2: Semantic Prefix.** All molecules must use the `V` prefix (e.g., `VFormField`).
> **Rule 3: No Margin Leakage.** Molecules do not define external margins. Use the parent's `gap` prop for spacing.

### Correct Composition Pattern

```vue
<VBox padding="md" rounded="lg" border="all">
  <VStack gap="sm">
    <VCluster justify="between">
      <VTypography weight="bold">Molecule Title</VTypography>
      <VCloseButton />
    </VCluster>
    <slot /> </VStack>
</VBox>

```

---

## 📂 Directory Structure

```text
src/components/molecules/
├── forms/          # Input clusters (VFormField, VInputGroup)
├── indicators/     # Feedback & Modals (VModal, VStatusCard)
├── navs/           # Lists & Tabs (VNavGroup, VNavTabs)
└── README.md       # You are here

```

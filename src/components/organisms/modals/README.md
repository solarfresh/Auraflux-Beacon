# Organisms: Modals

Organism-level modals are autonomous functional units. They bridge the gap between our **Design System** and **Business Logic**, transforming generic containers into interactive workflows like Authentication, Data Refinement, or Resource Management.

## 🧭 Design Principles

* **Self-Contained Logic**: Organism modals should manage their own internal state (e.g., `isSubmitting`, `localData`) while interacting with global stores (e.g., `useAuthStore`).
* **Atomic Orchestration**: Every element inside the modal must be a registered **Atom** or **Molecule**. Raw HTML is strictly prohibited.
* **Layout Consistency**: Use `VBox` for header/content/footer separation and `VForm` to manage vertical rhythm.
* **Teleportation**: All organisms in this category must be designed to be rendered via a global `ModalProvider` or `Teleport` to the `body` to avoid Z-index nesting issues.

---

## 🛠 Component Catalog

### 1. VLoginModal

The gateway to the application. It orchestrates user identity verification and session initiation.

* **Key Molecules**: `VForm`, `VFormField`, `VAlert`.
* **State Management**: Integrates with `authStore` to handle redirects and session persistence.
* **UX Pattern**: High-focus, centered layout with semantic error feedback.

### 2. VNodeRefinementModal (Planned)

A specialized tool for the Knowledge Graph. It allows users to edit "Conceptual Nodes" without leaving the canvas.

* **Key Molecules**: `VForm`, `VFormField`, `VButtonToolbar`.
* **Responsibility**: Mapping canvas coordinates to data updates.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Modal Layering.** Ensure the Organism uses the `VModal` molecule as its root. Do not re-implement the backdrop or close logic.
> **Rule 2: Logical Separation.** Validation logic belongs in the Organism, while visual error states belong in the `VFormField` molecule.
> **Rule 3: Gap Uniformity.** Always use `VForm` with `gap="md"` to ensure input fields are spaced consistently across all application modals.

### Standard Implementation Pattern

```vue
<template>
  <VModal :open="isOpen" @close="handleCancel">
    <VBox background="slate-50" padding="lg" border="bottom">
      <VTypography tag="h2" weight="bold">Strategic Task</VTypography>
    </VBox>

    <VBox padding="lg">
      <VForm @submit="handleCommit">
        <VFormField label="Input Label" v-slot="{ id }">
          <VInput :id="id" v-model="data" />
        </VFormField>
      </VForm>
    </VBox>
  </VModal>
</template>

```

---

## 🎨 Spacing & Elevation Tokens

| Element | Logic | Token |
| --- | --- | --- |
| **Backdrop** | Focus isolation | `bg-slate-900/50 backdrop-blur-sm` |
| **Surface** | Elevation | `shadow-2xl rounded-2xl` |
| **Sectioning** | Visual hierarchy | `VBox padding="lg"` (24px) |
| **Form Spacing** | Input rhythm | `VForm gap="md"` (16px) |

---

## 📂 Directory Structure

```text
src/components/organisms/modals/
├── VLoginModal.vue         # Auth orchestration
├── README.md               # You are here

```

# Molecules: The Functional Assembly

Molecules are the second layer of our Atomic Design system. They are groups of two or more **Atoms** bonded together to form a distinct, functional unit of the UI. Unlike Organisms, Molecules are relatively simple and focused on a single responsibility.

## 🧭 Layer Principles

* **Atomic Synergy:** Molecules must use Atoms (Button, Icon, Text) for all internal elements. Never use raw HTML.
* **Prop Propagation:** Molecules are responsible for passing states (like `disabled` or `loading`) down to their child Atoms.
* **Layout Agnostic:** While a Molecule has internal spacing, it should not define its own external margins or fixed widths.
* **Logic Boundary:** Molecules may contain UI logic (e.g., toggling an icon based on a prop), but they should not contain "Business Logic" (e.g., API calls).

---

## 📂 Sub-Directory Map

| Category | Description | Key Components |
| --- | --- | --- |
| **`actions/`** | Triggers and entry points for user intent. | `MessageInput`, `AuthButton`, `ActionBar`, `FormField` |
| **`navigation/`** | Components that help users move through the app. | `TabbedPanel` |
| **`feedback/`** | Status indicators and progress communication. | `ResearchValidation`, `FullScreenLoader` |
| **`overlays/`** | Content that floats above the main UI. | `Modal`, `CloseButton` |
| **`list-items/`** | Repetitive rows for sidebars and data feeds. | `SidebarNodeItem`, `KeywordListItem` |

---

## 🛠 Interaction Standards

### 1. Sizing Consistency

Molecules must maintain a consistent "Scale" among sibling Atoms.

* **Correct:** An `lg` Input paired with an `lg` Button.
* **Incorrect:** An `lg` Input paired with an `xs` Button.

### 2. Semantic Coloring

We follow a strict semantic palette across all molecules:

* **Primary/Active:** `indigo`
* **Success/Stable:** `emerald`
* **Warning/Pending:** `amber`
* **Danger/Alert:** `red`
* **Neutral/Secondary:** `gray`

---

## 🤖 AI Implementation Guide

> [!IMPORTANT]
> **Rule 1:** When creating a new molecule, determine its category first. If it's a row in a list, put it in `list-items/`. If it triggers a process, put it in `actions/`.
> **Rule 2:** Use **PascalCase** for all `iconName` props (e.g., `ArrowRight` instead of `arrow-right`).
> **Rule 3:** Always implement `hover` and `active` states using standard Tailwind tokens (e.g., `hover:bg-gray-50`).

### Example Composition

```vue
<div class="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-50">
  <VIcon name="Beaker" color="indigo-500" />
  <VTypography weight="medium">Experiment 01</VTypography
  <Button variant="ghost" size="xs" iconName="Trash" />
</div>

```

---

## 📂 Directory Structure

```text
src/components/molecules/
├── actions/      # User triggers & inputs
├── feedback/     # Status & progress
├── list-items/   # Repetitive data rows
├── navigation/   # Tabs & menus
├── overlays/     # Modals & floaters
└── README.md     # You are here

```

# Atoms: Actions

Actions are the interactive engines of the application. Components in this category are designed to handle user intent, trigger events, and provide immediate visual feedback for state changes.

## 🧭 Core Principles

* **Single Source of Truth**: The `Button.vue` atom is the **exclusive** component for all click-based interactions.
* **Interaction First**: Every action must provide clear hover, active, and focus states using system-standard tokens.
* **Agnostic Logic**: These components handle the *how* of interaction (styles, loading states) while remaining agnostic to the *what* (business logic).

---

## 🛠 Component Catalog

### 1. Button

The universal trigger. It replaces raw `<button>` tags and handles all visual variations, including icon-only modes.

* **Variants**: `primary`, `secondary`, `ghost`, `danger`, `outline`.
* **Sizes**: `xs`, `sm`, `md`, `lg`.
* **Key Feature [Icon Handling]**:
* When `iconOnly` is `true`, the component adjusts padding to maintain a perfect **1:1 square** (or circle) ratio.
* It internally manages the `Icon` atom's size based on the Button's `size` prop.



---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Specialized Wrappers.** Do not create or use `IconButton.vue`. Use `<VButton iconOnly />` instead.
> **Rule 2: Icon Naming.** Use the `iconName` prop with **PascalCase** (e.g., `ChevronRight`) to leverage internal dynamic icon rendering.
> **Rule 3: Size Coupling.** > - `size="xs"` button inside a list item → `size="4"` (16px) icon.
> * `size="md"` button → `size="5"` (20px) icon.
>
>

### Correct Implementation Pattern

```vue
<VButton variant="primary" @click="save">Save Changes</VButton>

<VButton
  variant="ghost"
  size="sm"
  iconOnly
  iconName="Trash"
  @click="remove"
/>

<VButton variant="outline" iconName="PlusIcon">Add Research</VButton>

```

---

## 🎨 Design Tokens

| Property | Value | Tailwind Class |
| --- | --- | --- |
| **Focus Ring** | Indigo 500 | `focus:ring-2 focus:ring-indigo-500 ring-offset-2` |
| **Radius** | Standard MD | `rounded-md` |
| **Icon Size (xs)** | 16px | Internal: `h-4 w-4` |
| **Icon Size (md)** | 20px | Internal: `h-5 w-5` |

---

## 📂 Directory Structure

```text
src/components/atoms/actions/
├── VButton.vue         # The exclusive trigger atom (Supports iconOnly)
└── README.md          # You are here

```

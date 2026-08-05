# Atoms: Buttons (Actions)

Buttons are the primary interactive atoms used to trigger events, submit forms, or navigate through the application. Following the **Bootstrap** model, they communicate intent through semantic coloring and provide clear visual feedback for user interactions.

## 🧭 Design Principles

* **Stateful Feedback**: Buttons must explicitly define `hover`, `active`, `focus`, and `disabled` states to ensure a responsive "Material" feel.
* **Semantic Intent**: Colors are mapped to system meanings:
* `primary`: Main call-to-action (Indigo).
* `ghost/secondary`: Low-emphasis actions.
* `danger`: Destructive actions (Red).


* **Affordance Consistency**: All buttons utilize a standard 8px grid for height and padding, ensuring they align perfectly with `Forms` atoms (e.g., `VInput`).
* **Minimalist Markup**: Buttons are designed to be "Margin-Free." Their positioning is always determined by their parent layout atom (e.g., `VCluster`).

---

## 🛠 Component Catalog

### 1. VButton

The **Universal Action Trigger**. It manages all interactive states, from text-heavy primary actions to minimalist icon-only controls.

* **Role**: **"Interaction" provider**. Handles semantic variants, sizing, and feedback states (loading/disabled).
* **Design Intent**: Replaces the legacy `VIconButton`. Use `iconOnly` to create perfect square/circular hit areas for toolbars and chips.
* **Key Props**:
* `variant`: `primary` | `secondary` | `tertiary` | `danger` | `outline` | `ghost`.
* `size`: `xs` | `sm` | `md` | `lg`.
* `iconName`: The Heroicon name string.
* `iconOnly`: (Boolean) Removes padding and text rendering for icon-centric UI.
* `loading`: (Boolean) Swaps content for a spinner and disables interaction.

### 2. VCloseButton

A specialized, high-frequency atom used to dismiss overlays, modals, and alerts.

* **Bootstrap Mapping**: Equivalent to `.btn-close`.
* **Standardization**: A circular (`rounded-full`), ghost-variant button containing a centered `XMark` icon.
* **Logic**: Defaults to an `aria-label="Close"` for accessibility.

### 3. VDropdownItem

A **specialized action atom** designed for menu systems and list-based interactions. It inherits the interaction logic of `VButton` but is styled for high-density vertical layouts.

* **Role**: **"Menu Action" provider**. It combines `VIcon` and `VTypography` to create consistent list entries.
* **Design Intent**: Used exclusively within `VDropdownMenu` (Molecule) or similar popover containers. It enforces a flat visual style while maintaining Material-level feedback on hover.
* **Key Props**:
    * `to`: (String | Object) If provided, renders as a `RouterLink` for navigation.
    * `iconName`: (String) Heroicon name for visual context.
    * `disabled`: (Boolean) Standard interaction suppression.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Raw Buttons.** Never use the `<button>` tag directly. Always use `<VButton>` to ensure the `indigo-500` focus ring and `rounded-md` corners are applied globally.
> **Rule 2: Size Pairing.** When placing a button next to a form input, ensure both use the same `size` prop (e.g., `md`) to maintain vertical alignment.
> **Rule 3: Icon Alignment.** Icons inside buttons must be wrapped in a `VIcon` atom and maintain a consistent gap (`gap-2`) with the text.
> **Rule 4: Compound Atom Integrity.** `VDropdownItem` must always utilize the `VTypography` atom for its label to ensure font-scale consistency. Avoid raw text strings or `<span>` tags inside the default slot without typography wrappers.

### Correct Implementation Pattern

```vue
<VButton variant="primary" @click="saveData">
  Save Changes
</VButton>

<VButton variant="ghost" iconOnly @click="toggleSettings">
  <VIcon name="Settings" size="sm" />
</VButton>

<VCloseButton @click="closeModal" />

<VDropdownItem iconName="User" to="/profile">
  User Profile
</VDropdownItem>

<VDropdownItem iconName="Power" @click="logout" class="text-danger">
  Sign Out
</VDropdownItem>
```

---

## 🎨 Design Tokens (Tailwind Mapping)

| Intent | Bootstrap Class | Tailwind Utility | Material State |
| --- | --- | --- | --- |
| **Primary** | `.btn-primary` | `bg-indigo-600 hover:bg-indigo-700` | Contained |
| **Secondary** | `.btn-secondary` | `bg-slate-100 hover:bg-slate-200` | Tonal |
| **Danger** | `.btn-danger` | `bg-red-600 hover:bg-red-700` | Error State |
| **Focus** | `:focus` | `ring-2 ring-indigo-500 ring-offset-2` | Focused |
| **Rounding** | `.rounded` | `rounded-md` (8px) | Standard Shape |

---

## 📂 Directory Structure

```text
src/components/atoms/buttons/
├── VButton.vue          # Universal action component
├── VCloseButton.vue     # Specialized dismiss trigger
├── VDropdownItem.vue    # Menu-specific action atom
└── README.md            # You are here

```

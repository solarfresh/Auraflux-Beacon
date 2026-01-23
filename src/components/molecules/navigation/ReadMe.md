# Molecules: Navigation

Navigation molecules are responsible for structural view switching and guiding the user through high-level application states. These components act as containers or controllers for significant layout changes.

## 🧭 Design Principles

* **Structural Intent**: Unlike list items, navigation molecules usually dictate the content of the entire surrounding layout or panel.
* **Visual Continuity**: Use the system primary color (`indigo-600`) to highlight the active path or selection.
* **Accessibility**: Must implement appropriate ARIA roles (e.g., `role="tablist"`, `role="tab"`) and support keyboard interaction.

---

## 🛠 Component Catalog

### 1. TabbedPanel

A container that organizes content into multiple switchable views using a horizontal navigation bar.

* **Composition**: `Button[variant="ghost"]` (acting as tab triggers) + `Text`.
* **Standardization**: Uses `indigo-600` for active bottom borders and bold text for the active state.
* **Flexibility**: Utilizes dynamic slots (e.g., `#tab-1-content`) to allow any component to be rendered within the panel.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1:** Use `Button` atoms for all clickable navigation triggers to ensure consistent hover/focus behavior.
> **Rule 2:** Avoid fixed heights in navigation headers; allow the `Text` atom's padding and line-height to define the footprint.
> **Rule 3:** Always sync the `aria-selected` attribute with the internal `activeTab` state for screen reader compatibility.

### Active State Logic

```vue
<Button
  variant="ghost"
  :class="isActive ? 'border-indigo-600' : 'border-transparent'"
>
  <Text :weight="isActive ? 'bold' : 'medium'">
    {{ label }}
  </Text>
</Button>

```

---

## 📂 Directory Progress

```text
src/components/molecules/navigation/
├── TabbedPanel.vue        # Fully standardized
└── README.md              # You are here

```

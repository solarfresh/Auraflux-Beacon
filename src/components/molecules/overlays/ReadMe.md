# Molecules: Overlays

Overlay molecules are components that appear on top of the main application content to provide focus, capture attention, or handle contextual tasks.

## 🧭 Design Principles

* **Layering (Z-Index)**: Must always have a higher z-index than standard page content.
* **Context Preservation**: Use backdrops (blur or dimming) to help the user maintain awareness of their previous location.
* **Dismissal**: Every overlay must have a clear and consistent way to be closed (e.g., `Escape` key, clicking the backdrop, or using a `CloseButton`).

---

## 🛠 Component Catalog

### 1. Modal

The primary container for focused user tasks.

* **Composition**: `Text` (Header) + `CloseButton` + `Slot` (Body/Footer).
* **Standardization**: Features a managed backdrop-blur and scale-in animation.
* **Accessibility**: Implements focus management and scroll locking.

### 2. CloseButton

A specialized trigger used within Modals, Popovers, and Alerts.

* **Composition**: `Button[variant="ghost", iconOnly]`.
* **Standardization**: Uses a `rounded-full` shape and `XMark` icon by default to provide a universal "dismiss" affordance.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1:** Never use raw HTML `<button>` inside an overlay. Always use the `Button` atom or `CloseButton` molecule to ensure focus rings match the design system.
> **Rule 2:** Modals should always utilize the `header` slot or `title` prop to ensure every dialog is identifiable by screen readers.
> **Rule 3:** The `CloseButton` should consistently be positioned in the top-right corner of overlay containers with standard padding (`p-4` or `p-6`).

---

## 📂 Directory Progress

```text
src/components/molecules/overlays/
├── Modal.vue               # Complex dialog container
├── CloseButton.vue         # Unified dismiss trigger
└── README.md               # You are here

```

# Molecules: Layout

Layout molecules are structural orchestrators. They manage the relationship between different spatial zones and provide interactive triggers for layout state changes (e.g., collapsing, expanding, or docking).

## 🧭 Design Principles

* **Spatial Integrity**: Layout molecules must respect the z-index hierarchy of the application. High-level controls (like `VFloatControl`) must never be obscured by content layers.
* **State-Driven Geometry**: Dimensional changes (width, height) should be tied to reactive states and accompanied by standard system transitions (`duration-300`).
* **Flow Independence**: Components in this category often use `absolute` or `fixed` positioning. They must be carefully encapsulated to avoid breaking the document flow of parent organisms.
* **Zero Magic Offsets**: All positioning offsets (e.g., how far a button sits from a sidebar) must be passed as props or derived from **Gap Tokens**.

---

## 🛠 Component Catalog

### 1. VFloatControl

A specialized floating trigger used to toggle the visibility or state of adjacent panels (Sidebars/Drawers).

* **Composition**: `VBox` (Positioning) > `VButton` > `VIcon`.
* **Logic**: Anchors to the edge of a parent container and moves in sync with panel transitions.
* **Physics**: Uses `shadow-md` to signify elevation above the workspace surface.

### 2. VResizableSplitter (Planned)

A divider that allows users to manually adjust the width/height ratio between two layout regions.

* **Composition**: `VBox` (Visual line) > `HTML Drag Events`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Coordinate Synchronization.** When a layout molecule controls a panel, both components must share the same CSS transition curve (`ease-in-out`) and duration (`300ms`) to prevent visual lagging.
> **Rule 2: Z-Index Discipline.** Layout molecules must use semantic z-index ranges. For example, `z-40` for floating controls ensures they sit above sidebars (`z-20`) but below modals (`z-50`).
> **Rule 3: Prop-Based Offsets.** Avoid hardcoding pixel values like `right: 384px`. Use props like `offset` so the layout can adapt to different sidebar widths.

### Standard Implementation Pattern

```vue
<template>
  <VFloatControl
    side="right"
    :is-open="uiState.isSidebarOpen"
    offset="320px"
    @toggle="uiState.toggleSidebar()"
  />
</template>

```

---

## 🎨 Layout & Elevation Tokens

| Element | Logic | Token / Value |
| --- | --- | --- |
| **Transitions** | Interaction rhythm | `300ms ease-in-out` |
| **Floating Depth** | Elevation | `shadow-md` |
| **Z-Index: Controls** | Floating triggers | `z-40` |
| **Z-Index: Panels** | Navigation units | `z-20` |

---

## 📂 Directory Structure

```text
src/components/molecules/layout/
├── VFloatControl.vue      # Floating panel triggers
├── VResizableSplitter.vue  # Interactive region dividers (Draft)
└── README.md              # You are here

```

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

### 2. VStaticGraph

The **Foundational Visual Anchor**. Orchestrates static graph primitives to evoke "structural logic" on landing pages or entry gateways.

* **Composition**: `VGraphCanvas` > `VGraphGroup` > `VGraphEdge` & `VGraphPoint`.
* **Role**: **"Spatial Identity" provider**.
* **Logic**: Strictly non-interactive. It uses fixed SVG coordinates to provide a consistent professional atmosphere.
* **Semantics**: Uses the shared `8, 5` dash token via `VGraphEdge` to maintain visual lineage with the interactive workspace.

### 3. VDropdownMenu

A **spatial container** used to orchestrate contextual actions and navigation links. It functions as a floating surface that appears over the workspace without disrupting the document flow.

* **Composition**: `VBox` (Container) > `VDropdownItem` (Atoms).
* **Role**: **"Contextual Anchor" provider**.
* **Logic**: Employs `absolute` positioning. It must be paired with a `relative` parent (usually an Organism like `Header`) to ensure correct anchoring.
* **Physics**: Utilizes `shadow-lg` (Level 3 Elevation) to signify its position at the top of the interaction hierarchy.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Coordinate Synchronization.** When a layout molecule controls a panel, both components must share the same CSS transition curve (`ease-in-out`) and duration (`300ms`) to prevent visual lagging.
> **Rule 2: Z-Index Discipline.** Layout molecules must use semantic z-index ranges. For example, `z-40` for floating controls ensures they sit above sidebars (`z-20`) but below modals (`z-50`).
> **Rule 3: Prop-Based Offsets.** Avoid hardcoding pixel values like `right: 384px`. Use props like `offset` so the layout can adapt to different sidebar widths.
> **Rule 4: Background Recess.** `VStaticGraph` must always be wrapped in a container with `overflow-hidden` and positioned at the lowest possible z-index (`z-0` or `z-[-1]`).
> **Rule 5: Pointer Neutrality.** Ensure `VStaticGraph` utilizes the `pointer-events-none` attribute from its underlying `VGraphCanvas` atom to prevent it from intercepting clicks on foreground CTA buttons.
> **Rule 6: Atomic Orchestration.** Never use raw `<line>` or `<circle>` tags inside `VStaticGraph`. Use the corresponding `VGraphEdge` and `VGraphPoint` atoms to ensure design token synchronization.
> **Rule 7: Overlay Anchoring.** `VDropdownMenu` should always be placed within a `relative` container. Use `right-0` or `left-0` to align the menu edges with its trigger button to maintain visual balance.
> **Rule 8: Interactive Continuity.** When implementing hover-based triggers, ensure the offset (`mt-1` or 4px) is small enough to prevent the pointer from leaving the interactive "bridge" between the trigger and the menu.

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

```vue
<template>
  <VStaticGraph>
    <VGraphGroup colorClass="text-slate-700/40">
      <VGraphEdge x1="100" y1="200" x2="400" y2="300" />
    </VGraphGroup>

    <VGraphGroup colorClass="text-slate-600/20">
      <VGraphEdge x1="400" y1="300" x2="700" y2="450" status="AI_EXTRACTED" />
    </VGraphGroup>
  </VStaticGraph>
</template>

<template>
  <VBox tag="div" class="relative group">
    <VButton
      variant="tertiary"
      icon-name="Cog6Tooth"
      icon-only
    />

    <VDropdownMenu class="hidden group-hover:block">
      <VDropdownItem icon-name="User" to="/profile">
        Profile
      </VDropdownItem>
      <VDropdownItem icon-name="ArrowRightOnRectangle" @click="logout">
        Logout
      </VDropdownItem>
    </VDropdownMenu>
  </VBox>
</template>
```

---

## 🎨 Layout & Elevation Tokens

| Element | Logic | Token / Value |
| --- | --- | --- |
| **Transitions** | Interaction rhythm | `300ms ease-in-out` |
| **Floating Depth** | Elevation | `shadow-md` |
| **Z-Index: Dropdowns** |	Overlay actions |	`z-60` |
| **Z-Index: Controls** | Floating triggers | `z-40` |
| **Z-Index: Panels** | Navigation units | `z-20` |
| **Edge Semantics** | Reliability | Solid (Verified) / Dashed (AI) |
| **Point Radius** | Anchor Size | `4px` (Standard) |

---

## 📂 Directory Structure

```text
src/components/molecules/layout/
├── VFloatControl.vue      # Floating panel triggers
├── VStaticGraph.vue       # Foundational visual anchor
├── VDropdownMenu.vue      # Spatial container for actions
└── README.md              # You are here

```

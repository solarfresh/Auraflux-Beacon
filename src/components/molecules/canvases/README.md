# Molecules: Canvases

Canvas molecules are spatial orchestrators designed to define the physical boundaries and interactive regions of graph nodes. In our **Atomic Design** architecture, these components represent the "Shell" of the graph data, ensuring that every node on the canvas maintains a consistent physical spec and semantic behavior regardless of its internal content.

## 🧭 Design Principles

* **Physical Determinism**: Molecules must enforce a minimum physical area (`min-w`) to prevent layout "jitter" when the **Graphviz** engine recalculates node positions.
* **Semantic Signaling**: The molecule is responsible for mapping backend state (e.g., `status`) to physical border tokens. This allows users to distinguish between **Verified** (Human) and **Suggested** (AI) data.
* **Slot-First Composition**: Canvas molecules must act as "Spatial Panel Controls." They manage the container logic (borders, shadows, padding) while providing slots for **Organisms** to inject specific business content.
* **Coordinate Synchronization**: All interactive elements (Handles) must be anchored relative to the molecule's boundary to maintain pixel-perfect edge connections.

---

## 🛠 Component Catalog

### 1. VNodeContainer

The **Physical Node Shell**. It defines the outer boundary, background, and state-driven border logic for any element on the graph.

* **Composition**: `VBox` > [`Slot` (Content), `Slot` (Overlay)].
* **Role**: Manages the "Spatial Skin." It handles selection rings, hover elevations, and the transition between solid and dashed borders.
* **Key Props**:
* `status`: `AI_EXTRACTED` | `LOCKED` (Determines border-style).
* `selected`: (Boolean) Triggers the indigo focus ring and higher elevation.
* `themeClass`: Contextual colors (e.g., `bg-blue-50 border-blue-500`).



---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Border Logic Mapping.** Never manually apply `border-dashed`. Always pass the `status="AI_EXTRACTED"` prop to `VNodeContainer` to ensure semantic consistency across the graph.
> **Rule 2: Interaction Hit Area.** Ensure the container includes sufficient internal padding (`padding="md"`) so that content does not overlap with the `VNodeHandle` atoms.
> **Rule 3: User-Select Prevention.** Canvas containers must implement `user-select: none` to prevent accidental text highlighting while the user is dragging nodes across the canvas.

### Standard Implementation Pattern

```vue
<VNodeContainer
  :status="data.status"
  :selected="selected"
  themeClass="bg-emerald-50 border-emerald-500 text-emerald-900"
>
  <VStack gap="xs">
    <VTypography weight="bold">{{ data.label }}</VTypography>
  </VStack>

  <template #overlay>
    <VNodeHandle id="n" type="target" :position="Position.Top" colorClass="bg-emerald-500" />
    <VNodeHandle id="s" type="source" :position="Position.Bottom" colorClass="bg-emerald-500" />
  </template>
</VNodeContainer>

```

---

## 🎨 Layout Tokens (Molecule Specific)

| Relationship | Logic | Token |
| --- | --- | --- |
| **Node Boundary** | Minimum physical spec | `min-w-[200px]` |
| **Verified State** | Human-confirmed data | `border-solid` |
| **Suggested State** | AI-generated hypothesis | `border-dashed` |
| **Resting Depth** | Static node on canvas | `shadow-sm` |
| **Active Depth** | Selected or dragging node | `shadow-lg` |

---

## 📂 Directory Structure

```text
src/components/molecules/canvases/
├── VNodeContainer.vue      # Node shell & state orchestrator
└── README.md               # You are here

```
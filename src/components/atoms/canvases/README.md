# Atoms: Canvases (Graph Foundations)

Canvases atoms are the fundamental structural units used to build a node-link diagram within the **Vue Flow** ecosystem. These components handle the raw physical properties of the graph—such as connection ports and coordinate anchoring—ensuring that the canvas remains performant and logically consistent.

## 🧭 Design Principles

* **Port Precision**: Connection points (Handles) must align with **Graphviz** port logic (`n`, `s`, `e`, `w`) to support automated layout transitions without edge overlapping.
* **Semantic Signaling**: Visual markers (borders and colors) must communicate the origin and reliability of data (e.g., AI-generated vs. Human-verified).
* **LOD (Level of Detail) Readiness**: Atoms are designed to be "Zoom-Aware," maintaining interactive hit areas even when the node content is simplified at low zoom levels.
* **Input/Output Decoupling**: Target (input) and Source (output) handles are visually distinct but share a unified coordinate system to ensure pixel-perfect edge anchoring.

---

## 🛠 Component Catalog

### 1. VNodeHandle

The **Standardized Connection Port**. It wraps the Vue Flow `<Handle />` to provide consistent sizing and interaction states.

* **Role**: **"Logic Anchor" provider**. It defines where an edge starts or ends.
* **Design Intent**: Replaces raw `<Handle />` tags. It ensures every port has a white "halo" border to remain visible against dark edges or grid backgrounds.
* **Key Props**:
* `id`: (String) Mapping key for Graphviz ports (e.g., `top`, `bottom`).
* `type`: `source` | `target`.
* `position`: `Position.Top` | `Position.Bottom` | `Position.Left` | `Position.Right`.
* `colorClass`: Tailwind background class (e.g., `bg-blue-500`) to match the node's theme.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Coordinate Port Mapping.** Always provide a unique `id` for each `VNodeHandle`. This allows the backend layout engine to pin edges to specific sides of the node.
> **Rule 2: Interaction Hit Area.** Never shrink handles below `12px` (`!w-3 !h-3`). While they may look small, the "invisible" hit area must remain large enough for mouse interaction.
> **Rule 3: Semantic Consistency.** The `colorClass` of the `VNodeHandle` must match the `border-color` of its parent `NodeContainer` to maintain visual grouping.

### Correct Implementation Pattern

```vue
<VNodeContainer :status="data.status">
  <VNodeHandle id="n" type="target" :position="Position.Top" colorClass="bg-emerald-500" />
  <VNodeHandle id="s" type="source" :position="Position.Bottom" colorClass="bg-emerald-500" />
</VNodeContainer>

```

---

## 🎨 Design Tokens (Tailwind Mapping)

| Component Part | Attribute | Tailwind Utility | Purpose |
| --- | --- | --- | --- |
| **Handle Core** | Size | `!w-3 !h-3` | Fixed hit area |
| **Handle Halo** | Border | `border-2 border-white` | Visibility on grid |
| **Handle Hover** | Animation | `transition-transform hover:scale-125` | Interactive feedback |
| **Status Badge** | Positioning | `absolute -top-3 left-2` | Overlap anchor |
| **Status Text** | Typography | `text-[10px] font-bold uppercase` | Micro-copy clarity |

---

## 📂 Directory Structure

```text
src/components/atoms/canvases/
├── VNodeHandle.vue        # Standardized port component
└── README.md              # You are here

```

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

### 2. VNodeShape

The **Zoom-Resilient Vector Border**. Encapsulates SVG logic to maintain visual clarity across the coordinate system.

* **Role**: **"Verification Signal" provider**. Ensures "Verified" vs. "AI-Extracted" states are distinguishable at any zoom level.
* **Design Intent**: Uses `vector-effect: non-scaling-stroke` to prevent border thinning during zoom-out operations.
* **Key Props**:
* `status`: `AI_EXTRACTED` (Dashed) | `LOCKED` (Solid).
* `borderRadius`: (Number) Standardized at `12` for `rounded-xl` alignment.

### 3. VNodeShield

The **Physical Background Surface**. Manages the base layer and elevation of the research entity.

* **Role**: **"Surface & Elevation" provider**.
* **Design Intent**: Handles background design tokens and interaction offsets (hover/selection lift).
* **Key Props**:
* `themeClass`: Tailwind utility for semantic coloring (e.g., `bg-emerald-50`).
* `selected`: (Boolean) Triggers `ring` and `scale` transforms.
* `padding`: `none` | `xs` | `sm` | `md`.

### 4. VGraphEdge

The **Visual Connectivity Vector**. A lightweight primitive for rendering relationships, optimized for non-interactive backgrounds and static molecules.

* **Role**: **"Relationship" provider**. It bridges two spatial coordinates without the overhead of the Vue Flow edge lifecycle.
* **Design Intent**: Uses the same dash-tokens as `VNodeShape` to ensure visual brand consistency across the landing page and the app.
* **Key Props**:
    * `x1, y1, x2, y2`: (Number/String) Start and end coordinates.
    * `status`: `AI_EXTRACTED` (Dashed) | `LOCKED` (Solid).
* **Differences from VNodeShape**: Unlike `VNodeShape`, which is a bounding box (`rect`), `VGraphEdge` is a directional vector (`line`).

### 5. VGraphPoint

The **Low-Fidelity Anchor**. A simplified, vector-based representation of a node used for visual "texture" on the landing page.

* **Role**: **"Spatial Reference" provider**.
* **Design Intent**: Strips away the complex layering of `VNodeShield` (no shadows, no handles) to maximize rendering speed in high-density static graphs.
* **Key Props**:
    * `x, y`: (Number/String) Center coordinate.
    * `radius`: (Number) Standardized at `4` for a clean, professional look.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Coordinate Port Mapping.** Always provide a unique `id` for each `VNodeHandle`. This allows the backend layout engine to pin edges to specific sides of the node.
> **Rule 2: Interaction Hit Area.** Never shrink handles below `12px` (`!w-3 !h-3`). While they may look small, the "invisible" hit area must remain large enough for mouse interaction.
> **Rule 3: Semantic Consistency.** The `colorClass` of the `VNodeHandle` must match the `border-color` of its parent `NodeContainer` to maintain visual grouping.
> **Rule 4: Stroke Scaling.** Always use `VNodeShape` for borders instead of CSS `border` properties. This ensures the dash-gap ratio remains constant at low zoom levels.
> **Rule 5: Surface Elevation.** `VNodeShield` must include `will-change: transform` to optimize GPU rendering during rapid canvas panning.
> **Rule 6: Content Layering.** In a `VNodeContainer` (Molecule), the `VNodeShape` must be placed **after** the content to ensure the vector border remains the top-most visual layer.
> **Rule 7: Static vs. Dynamic Separation.** Use `VGraphEdge/Point` for background visualizations and landing page molecules (`VStaticGraph`). Use `VNode*` atoms exclusively for the interactive `Auraflux-Beacon` workspace.
> **Rule 8: Internal Consistency.** The `stroke-dasharray` of `VGraphEdge` must always match `VNodeShape` (8, 5) to maintain the semantic link between suggested data across the entire ecosystem.
> **Rule 9: Namespace Purity.** Do not use `xmlns` links or external URIs within these atoms. They are designed to be rendered within a `VGraphCanvas` (Layout Atom) which manages the SVG environment.

### Correct Implementation Pattern

```vue
<VNodeShield :themeClass="data.theme" :selected="selected">
  <slot />
  <VNodeShape :status="data.status" />
  <VNodeHandle id="s" type="source" :position="Position.Bottom" />
</VNodeShield>

```

---

## 🎨 Design Tokens (Tailwind Mapping)

| Component Part | Attribute | Tailwind Utility | Purpose |
| --- | --- | --- | --- |
| **Handle Core** | Size | `!w-3 !h-3` | Fixed hit area |
| **Shield Surface** | Rounding | `rounded-xl` | Level 1 Container |
| **Shield Active** | Transform | `scale-[1.02]` | Selection prominence |
| **Shape Dash** | Pattern | `8, 5` (SVG Array) | AI Extraction signal |
| **Shape Weight** | Stroke | `2.5px` | Zoom visibility |
| **Graph Point** | Fill | `fill-current` | Color inheritance |

---

## 📂 Directory Structure

```text
src/components/atoms/canvases/
├── VNodeHandle.vue        # Standardized port component
├── VNodeShape.vue         # Zoom-resilient vector border
├── VNodeShield.vue        # Background and elevation surface
├── VGraphEdge.vue         # Static connectivity vector
├── VGraphPoint.vue        # Low-fidelity anchor point
└── README.md              # You are here

```

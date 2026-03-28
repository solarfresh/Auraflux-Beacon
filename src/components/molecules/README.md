# Molecules Layer

Molecules are groups of **Atoms** bonded together to form the smallest functional units of the UI. Following the **Bootstrap** categorization model, these components handle specific user tasks like capturing form data, displaying complex status, or managing navigation groups.

## 🏗 The Architecture

To maintain a flat and predictable structure, all molecules are categorized into three core families that mirror the Atoms layer.

### 1. 📝 [Forms](forms/README.md) (Input Groups)

Complex input patterns that combine labels, inputs, and actions.

* **Key Components:** `VForm`, `VFormField`, `VInputGroup`, `VButtonToolbar`.
* **Focus:** Accessibility (A11y), validation feedback, and input synchronization.

### 2. 📢 [Indicators](indicators/README.md) (Feedback & Overlays)

Composite components that communicate status or manage contextual focus. **This family uses the `VAlert` base for all semantic feedback.**

* **Key Components:** `VAlert`, `VStatusCard`, `VFeasibilityStatus`, `VEntityWorkflowStatus`, `VReflectionStatus`, `VEmptyState`, `VInteractivePlaceholder`, `VModal`, `VOverlayLoader`, `VEntityChip`.
* **Focus:** Material elevation, backdrop management, and semantic signaling.

### 3. 🧭 [Navs](navs/README.md) (Navigation & Lists)

Structural clusters used for moving through the application's architecture.

* **Key Components:** `VNavGroup`, `VNavTabs`, `VNavListItem`, `VActionListItem`, `VTagListItem`, `VTimelineItem`.
* **Focus:** Hierarchical depth, active state management, and responsive truncation.

參考你提供的 `Navs` 格式，以下是針對 `Layout` 分子類別的描述。這段文字適合放在 `molecules/README.md` 的總覽清單中：

### 4. 🧭 [Layout](layout/README.md) (Spatial & Panel Controls)

Orchestrators that manage the relationship between different spatial zones and interactive regions.

* **Key Components:** `VFloatControl`, `VResizableSplitter`, `VLayoutDivider`, `VPanelHeader`.
* **Focus:** Z-index hierarchy, coordinate synchronization, and reactive structural transitions.

### 5. 🕸 [Canvases](canvases/README.md) (Graph Infrastructure)

Composite components that define the physical boundaries and interactive regions of a graph node.

* **Key Components:** `VNodeContainer`.
* **Focus:** Semantic border logic (Solid/Dashed), physical specification (min-width/padding), and state-driven visual feedback (Selection/Hover).

---

## 🧭 Global Molecule Principles

### 1. Composition over CSS

Molecules **must** be built using layout atoms (`VBox`, `VStack`, `VCluster`). Never use raw Flexbox or Grid classes inside a molecule if a layout atom can achieve the same result.

* **Right:** `<VCluster gap="md">...</VCluster>`

### 2. Semantic Hierarchy (Specific to Indicators)

Indicators follow a specialized inheritance pattern to ensure visual consistency:

1. **Base:** `VAlert` handles semantic tokens (Success, Warning, Danger).
2. **Layout:** `VStatusCard` wraps `VAlert` to provide a standard Icon + Title layout.
3. **Business:** `VFeasibilityStatus` wraps `VStatusCard` to map domain data.

### 3. Source of Truth

The molecule is responsible for synchronized state. If an input is `disabled`, the molecule must propagate that state to its child buttons and labels.

### 4. Attribute Inheritance

Always use `inheritAttrs: false` in the component script and bind `$attrs` to the root layout atom. This ensures that parent-injected spacing is applied correctly to the outer container.

### 5. State-to-Visual Mapping (Canvases Only)

Canvas molecules must map backend state (e.g., `status`) to physical border tokens.
* **Verified/Manual:** Use `border-solid`.
* **Suggested/AI:** Use `border-dashed`.
This ensures the user can immediately distinguish between human-curated and machine-generated data across the entire canvas.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Atomic Integrity.** A molecule must be composed of 2 or more Atoms.
> **Rule 2: Semantic Prefix.** All molecules must use the `V` prefix (e.g., `VStatusCard`).
> **Rule 3: Bootstrap Alignment.** Naming should reflect Bootstrap semantics (e.g., `NavTabs` for navigation, `Alert` for feedback).
> **Rule 4: Graph Physicality.** Canvas molecules must enforce a minimum physical area (`min-w` / `min-h`) to prevent layout "jitter" when the Graphviz engine recalculates node positions.

### Correct Composition Pattern (Indicator Example)

```vue
<VStatusCard
  variant="success"
  icon-name="CheckCircle"
>
  <template #title>Data Verified</template>
  <VTypography size="xs">Grounding check completed successfully.</VTypography>
</VStatusCard>

```

---

## 📂 Directory Structure

```text
src/components/molecules/
├── canvases/       # VNodeContainer
├── forms/          # VFormField, VInputGroup, VButtonToolbar
├── indicators/     # VAlert, VStatusCard, VFeasibilityStatus, VEntityWorkflowStatus, VModal, VOverlayLoader, VStatusScore, VStepProgress, VReflectionStatus, VEmptyState, VEntityChip, VISPStepCard
├── layout/         # VFloatControl, VStatucGraph
├── navs/           # VNavGroup, VNavTabs, VNavListItem, VActionListItem, VTagListItem, VTimelineItem, VTreeItem, VWelcomeGateway
└── README.md       # You are here
```

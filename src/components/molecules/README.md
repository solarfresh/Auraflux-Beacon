# Molecules Layer

Molecules are groups of **Atoms** bonded together to form the smallest functional units of the UI. Following the **Bootstrap** categorization model, these components handle specific user tasks like capturing form data, displaying complex status, or managing navigation groups.

## 🏗 The Architecture

To maintain a flat and predictable structure, all molecules are categorized into three core families that mirror the Atoms layer.

### 1. 📝 [Forms](forms/README.md) (Input Groups)

Complex input patterns that combine labels, inputs, and actions.

* **Key Components:** `VForm`, `VFormField`, `VInputGroup`, `VButtonToolbar`.
* **Focus:** Accessibility (A11y), validation feedback, and input synchronization.

#### 2\. 📢 [Feedback](https://www.google.com/search?q=feedback/README.md) (System Response)

Stateless observers that communicate system status or manage contextual focus.

  * **Key Components:** `VAlert`, `VModal`, `VOverlayLoader`, `VStatusScore`, `VUserAvatar`.
  * **Focus:** Immediate reaction, backdrop management, and presence feedback.

#### 3\. 📦 [Resources](https://www.google.com/search?q=resources/README.md) (Data Entities)

Data-driven tiles or chips that represent persisted resources like Projects or Agents.

  * **Key Components:** `VProjectCard`, `VEntityChip`, `VStatusCard`, `VInteractivePlaceholder`.
  * **Focus:** "Flat Skin" architecture (VBox), entity lifecycle mapping, and grid compatibility.

#### 4\. 🧠 [Domain](https://www.google.com/search?q=domain/README.md) (Methodology & Logic)

Method-heavy components that encapsulate specific research frameworks (ISP) or AI decision logic.

  * **Key Components:** `VISPStepCard`, `VFeasibilityStatus`, `VEntityProjectStatus`, `VReflectionStatus`.
  * **Focus:** Cognitive orientation, AI attribution signaling, and methodological integrity.

### 5. 🧭 [Navs](navs/README.md) (Navigation & Lists)

Structural clusters used for moving through the application's architecture.

* **Key Components:** `VNavGroup`, `VNavTabs`, `VNavListItem`, `VActionListItem`, `VTagListItem`, `VTimelineItem`.
* **Focus:** Hierarchical depth, active state management, and responsive truncation.

### 6. 🧭 [Layout](layout/README.md) (Spatial & Panel Controls)

Orchestrators that manage the relationship between different spatial zones and interactive regions.

* **Key Components:** `VFloatControl`, `VResizableSplitter`, `VLayoutDivider`, `VPanelHeader`.
* **Focus:** Z-index hierarchy, coordinate synchronization, and reactive structural transitions.

### 7. 🕸 [Canvases](canvases/README.md) (Graph Infrastructure)

Composite components that define the physical boundaries and interactive regions of a graph node.

* **Key Components:** `VNodeContainer`.
* **Focus:** Semantic border logic (Solid/Dashed), physical specification (min-width/padding), and state-driven visual feedback (Selection/Hover).

---

## 🧭 Global Molecule Principles

### 1. Composition over CSS

Molecules **must** be built using layout atoms (`VBox`, `VStack`, `VCluster`). Never use raw Flexbox or Grid classes inside a molecule if a layout atom can achieve the same result.

* **Right:** `<VCluster gap="md">...</VCluster>`

**2. Semantic Hierarchy (Functional Mapping)**
Molecules follow a specialized mapping pattern to ensure visual consistency:

1.  **Base (Feedback):** `VAlert` handles raw semantic tokens (Success, Warning, Danger).
2.  **Structural (Resources):** `VStatusCard` (now in Resources) provides a generic shell for simple data entities.
3.  **Business (Resources/Domain):** `VProjectCard` or `VFeasibilityStatus` map complex domain data to visual tokens.

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
> **Rule 5: Directory Affinity.** Strictly follow the directory intent:
>
>   * **Feedback:** Stateless system reactions only.
>   * **Resources:** Direct mapping to database entities (Projects, Agents).
>   * **Domain:** High-coupling with research methodology (ISP).

---

## 📂 Directory Structure

```text
src/components/molecules/
├── canvases/       # VNodeContainer
├── domain/         # VISPStepCard, VFeasibilityStatus, VReflectionStatus
├── feedback/       # VAlert, VModal, VOverlayLoader, VStatusScore, VUserAvatar
├── forms/          # VFormField, VInputGroup, VButtonToolbar
├── layout/         # VFloatControl, VStatucGraph
├── navs/           # VNavGroup, VNavTabs, VNavListItem, VActionListItem, VTagListItem, VTimelineItem, VTreeItem, VWelcomeGateway
├── resources/      # VProjectCard, VEntityChip, VStatusCard, VInteractivePlaceholder
└── README.md       # You are here
```

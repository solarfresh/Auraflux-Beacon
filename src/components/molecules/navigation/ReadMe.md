# Molecules: Navigation

Navigation molecules facilitate movement through the application’s information architecture, managing visibility, grouping, and user attention.

## 🧭 Design Principles

* **Directional Clarity**: Indicators (Chevrons, active states) must clearly communicate where the user is going or what is currently expanded.
* **Contextual Guidance**: Navigation elements should prioritize items requiring attention (e.g., using status colors or item counts).
* **Smooth Transitions**: Toggles and active state shifts should use standard durations (`transition-all duration-200`) to feel responsive.

---

## 🛠 Component Catalog

### 1. SectionGroup

A structural wrapper for grouping related list items within a Management Section.

* **Key Features**: Supports **Collapsible** states and **Variant-based header styling** (Indigo, Amber, Gray).
* **Slots**: Primary content area and a `footer` for "View All" actions.

### 2. ViewListItem

A specialized navigation item for switching between different Workspace/Canvas views.

* **Logic**: Implements high-contrast `isActive` styling to signify the current environment.

### 3. UnifiedReviewAlert

A high-level navigation banner that surfaces items requiring user intervention across multiple sections.

* **Logic**: Aggregates `unreviewedCount` from Keywords and Scope.
* **Interaction**: Acts as a **Deep Link**; clicking it triggers a scroll or focus event to the first relevant section.
* **Placement**: Usually positioned at the top of the `MasterListPanel` for maximum visibility.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: State Sync.** `SectionGroup` should ideally use `v-model:open` if the parent needs to programmatically expand it (e.g., when clicking a Review Alert).
> **Rule 2: Visual Hierarchy.** The `UnifiedReviewAlert` uses `indigo-50` backgrounds and `backdrop-blur` to distinguish itself from standard content sections.
> **Rule 3: Scalability.** Navigation items must handle long text via `truncate` to prevent horizontal layout overflows in the fixed-width sidebar.

### Implementation Pattern: Cross-Section Navigation

```vue
<UnifiedReviewAlert
  :keywords="keywords"
  :scope="scope"
  @scroll-to-review="handleScroll"
/>

<SectionGroup
  title="To Review"
  variant="amber"
  collapsible
  :open="activeSection === 'keyword'"
>
  </SectionGroup>

```

---

## 📂 Directory Progress

```text
src/components/molecules/navigation/
├── SectionGroup.vue       # Collapsible container for list items
├── UnifiedReviewAlert.vue # New: Cross-section attention director
├── ViewListItem.vue       # Canvas/Workspace switcher
└── README.md              # You are here

```

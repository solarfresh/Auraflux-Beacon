# 📂 Organisms: Forms

This directory contains business-logic-heavy forms that manage the lifecycle of research data. These organisms coordinate multiple atoms and molecules to provide a seamless editing experience.

## 🏗 Form Catalog

### 1. Final Research Question

* **`FinalQuestionEditor`**: The definitive editor for the research statement. It features a stability scoring system and a locking mechanism to finalize the research direction.
* **`KeywordListRefinementForm`**: A high-level manager for research keywords. It utilizes `VEntityChip` for tag management and `VEmptyState` for zero-data guidance.
* **`ScopeListRefinementForm`**: A dual-column manager for Inclusion and Exclusion criteria, using segmented button controls and scroll-locked containers.

### 2. Entity Detail Editors

* **`KeywordDetailEditor`**: A focused form for editing individual keyword properties, metadata, and status.
* **`ScopeDetailEditor`**: A focused form for refining specific research boundaries, allowing for detailed justification of inclusion/exclusion logic.

### 3. Reflection & Logging

* **`ReflectionLogForm`**: The primary input organism for recording research progress, insights, and roadblocks.
* **`ReflectionLogEditorPanel`**: A fly-out or modal panel that wraps the log form, providing context-aware feedback and submission controls.

---

## 🛠 Component Specifications

### FinalQuestionEditor

* **Logic**: Monitors character counts (min 10) and displays a `VStatusCard` if the stability score is below threshold.
* **Actions**: "Confirm & Finalize" triggers a system-wide lock on the research question.

### KeywordListRefinementForm

* **Logic**: Prevents duplicates, handles immediate unshift (adding to top), and maps `EntityStatus` to semantic colors via `VEntityChip`.
* **Layout**: Uses a scrollable `VBox` to manage large keyword clusters without breaking the modal height.

### ScopeListRefinementForm

* **Logic**: Manages a dual-list state. The segmented toggle (Inclusion/Exclusion) determines the `boundaryType` of new entries.
* **Layout**: Employs a `grid-cols-2` layout with independent scrollable columns.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Bare HTML.** All forms must use `VBox`, `VStack`, and `VCluster` for layout. Do not use `div` or `span` for structural positioning.
> **Rule 2: Atomic Actions.** Use `VButton` for all triggers. For segmented controls (toggles), use a group of `VButton` atoms inside a `VBox` container.
> **Rule 3: State Management.** Forms should maintain a `localCopy` of data and only emit `save` or `update` events upon user confirmation to prevent accidental data loss.

---

## 📂 Directory Structure

```text
src/components/organisms/forms/
├── FinalQuestionEditor.vue         # Final research statement tool
├── KeywordDetailEditor.vue         # Individual keyword refinement
├── KeywordListRefinementForm.vue   # Keyword cluster manager
├── ReflectionLogEditorPanel.vue    # Container for log editing
├── ReflectionLogForm.vue           # Core insight entry form
├── ScopeDetailEditor.vue           # Individual scope refinement
└── ScopeListRefinementForm.vue     # Boundary management tool

```

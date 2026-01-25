# Organisms: Sections

Sections are the primary functional modules of the sidebar. They act as "Orchestrators," receiving data props and distributing them to specialized Molecules and Atoms.

## 🧭 Design Principles

* **Layout Standardization**: Every section must utilize `BaseSectionLayout` to ensure consistent headers, spacing, and border treatments.
* **Slot-Based Architecture**: Use the `#header-actions`, `#stats`, and `#content` slots to maintain a uniform information hierarchy.
* **Encapsulated Logic**: Business logic regarding status-based filtering (e.g., separating "Locked" from "Review" items) should reside within these components.
* **Empty State Handling**: Sections must provide clear visual feedback using the `Icon` and `Text` atoms when no data matches current filters.

---

## 🛠 Component Catalog

### 1. KeywordManagementSection

Orchestrates the research vocabulary.

* **Features**: Separates validated core terms from AI-generated suggestions.
* **Logic**: Uses `SectionGroup` to categorize keywords by `LOCKED`, `REVIEW`, and `ON_HOLD` statuses.

### 2. ScopeManagementSection

Orchestrates the research boundaries and project constraints.

* **Features**: Visualizes Inclusions and Exclusions as interactive list items.
* **Logic**: Shares the same status-grouping logic as the Keyword section to maintain cognitive consistency for the user.

### 3. ResourceRepository

The central asset hub for research materials.

* **Features**: Implements a robust filtering system for `ResourceSource` types and a real-time search engine.
* **Interactions**: Hosts `ResourceListItem` components with native drag-and-drop capabilities for Canvas integration.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Base Layout Injection.** Never build a section with raw HTML tags. All sections must be wrapped in the `<BaseSectionLayout>` organism.
> **Rule 2: Props as Source of Truth.** Sections should remain presentational orchestrators; they receive data arrays via props from the `MasterListPanel` or a central Store.
> **Rule 3: Density Control.** Use the `xs` size for buttons and badges within sections to maximize information density in the narrow sidebar environment.

### Standard Section Hierarchy

```vue
<template>
  <BaseSectionLayout title="Section Title">
    <template #header-actions>
      <VButton variant="ghost" size="xs" iconOnly iconName="Plus" />
    </template>

    <template #stats>
      <VBadge variant="indigo">3 Locked</VBadge>
    </template>

    <template #content>
      <ul class="flex flex-col gap-2">
         <ListItem v-for="item in items" :key="item.id" :data="item" />
      </ul>
    </template>
  </BaseSectionLayout>
</template>

```

---

## 📂 Directory Progress

```text
src/components/organisms/sections/
├── BaseSectionLayout.vue      # The layout engine for all sections
├── KeywordManagementSection.vue
├── ResourceRepository.vue
├── ScopeManagementSection.vue
└── README.md                  # You are here

```

# Molecules: List Items

List items are specialized molecules designed to represent data entities within sidebars, feeds, or master-detail panels. They act as the interactive bridge between raw data (interfaces) and the UI layout.

## 🧭 Design Principles

* **Atomic Structure**: Every list item must use a `Box` atom as its root. This ensures that internal padding, borders, and backgrounds are managed through design tokens rather than magic strings.
* **Gap-Driven Spacing**: Items never carry external margins (`m-`, `mt-`, `mb-`). Vertical or horizontal spacing between items is strictly managed by the parent container's `Stack` or `Cluster` gap props.
* **Contextual Feedback**: Items must provide clear visual cues for `isActive` (selection), `hover` (affordance), and `groundedness` (data quality/AI alerts).
* **Attribute Flattening**: All list item molecules use `inheritAttrs: false` and bind `$attrs` to the root `Box`. This prevents recursive class nesting (e.g., `['p-2', ['p-2']]`) and ensures a single layer of CSS classes in the DOM.

---

## 🛠 Component Catalog

### 1. ReflectionLogListItem

Visualizes research journal entries. Optimizes for chronological scanning.

* **Composition**: `Box` > `Stack` > [`Cluster` (Date/Badge), `Text` (Title), `Text` (Excerpt)].
* **Key Prop**: `isActive` (Indigo highlight).

### 2. KeywordListItem

Represents research keywords with status-based coloring.

* **States**: `LOCKED`, `AI_EXTRACTED`, `ON_HOLD`, `USER_DRAFT`.
* **Composition**: `Box` > `Cluster` > [`Icon`, `Stack` (Label/Status), `Button` (Action)].

### 3. ResourceListItem

Represents collected materials (PDFs, URLs, etc.). Supports Drag & Drop.

* **Key Features**: Draggable surface, metadata badges for `sourceType` and `format`, and visual indicators for `userNotes`.
* **Composition**: `Box` > `Stack` > [`Cluster` (Header), `Text` (Summary), `Cluster` (Footer Tags)].

### 4. ScopeListItem

Visualizes inclusion/exclusion criteria for research boundaries.

* **Composition**: `Box` > `Cluster` > [`Icon`, `Cluster` (Label + Rationale), `Icon` (Chevron)].
* **Key Logic**: Uses `min-w-0` and `truncate` on the rationale to prevent layout breaking.

### 5. SidebarNodeItem

A complex navigation molecule for the Conceptual Map.

* **Advanced Features**: Implements **Anti-Hallucination Jitter** animation for low-groundedness data and **Solidity Lights** for evidence-backed nodes.

### 6. ViewListItem

A lean molecule for switching workspace perspectives.

* **Composition**: `Box` > `Cluster` > [`Icon`, `Text`, `StatusDot`].

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Raw Tags.** Replace all `<li>` or `<div>` containers with the `Box` atom.
> **Rule 2: Proper Truncation.** When displaying titles or long text, use the `truncate` prop on the `Text` atom and ensure the parent `Cluster` has `min-w-0 flex-1`.
> **Rule 3: Hover Visibility.** Action buttons (like Edit/Delete) should be wrapped in a container with `opacity-0 group-hover:opacity-100` to maintain high visual density when not focused.

### Standard "Industrial" Item Pattern

```vue
<template>
  <Box
    padding="sm"
    rounded
    clickable
    v-bind="$attrs"
    :background="isActive ? 'indigo-50' : 'white'"
  >
    <Cluster justify="between" align="center" full-width>
      <Cluster gap="md" class="min-w-0 flex-1">
        <Icon :name="icon" />
        <Text truncate>{{ label }}</Text>
      </Cluster>
      <Button variant="ghost" class="opacity-0 group-hover:opacity-100" />
    </Cluster>
  </Box>
</template>

```

---

## 📂 Directory Structure

```text
src/components/molecules/list-items/
├── KeywordListItem.vue
├── ReflectionLogListItem.vue
├── ResourceListItem.vue
├── ScopeListItem.vue
├── SidebarNodeItem.vue
├── ViewListItem.vue
└── README.md

```

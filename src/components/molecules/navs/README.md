# Molecules: Navs

Nav molecules (List Items) are specialized clusters designed to represent data entities within sidebars, feeds, or master-detail panels. They serve as interactive bridges between raw data and UI layouts, leveraging the **Bootstrap List Group** model and **Material Design** state feedback.

## 🧭 Design Principles

* **Box-Based Containment**: Every list item must use the `VBox` atom as its root to manage internal padding and surface tokens consistently.
* **Responsive Truncation**: When labels or descriptions exceed their container, always use the `truncate` prop on `VTypography` combined with `min-w-0` on the parent `VCluster`.
* **State-Driven Logic**: Items must explicitly handle `isActive`, `isDisabled`, and `isFocused` states using standard system tokens (e.g., `indigo-50` for active backgrounds).
* **Zero External Margin**: Vertical spacing between items is managed by the parent's `VStack` or `VCluster` gap, never by the item itself.

---

## 🛠 Component Catalog

### 1. VNavListItem

A lean molecule for basic navigation.

* **Composition**: `VBox` > `VCluster` > [`VIcon`, `VTypography`, `VStatusDot`].

### 2. VTagListItem

Represents entities with specific status-based coloring.

* **Composition**: `VBox` > `VCluster` > [`VIcon`, `VStack` (Label/Status), `VButton` (Action)].

### 3. VMetaListItem

For complex data entities (e.g., Resources, Documents).

* **Composition**: `VBox` > `VStack` > [`VCluster` (Header), `VTypography` (Summary), `VCluster` (Tags)].

### 4. VTimelineItem

Optimized for chronological scanning of logs or journals.

* **Composition**: `VBox` > `VStack` > [`VCluster` (Date/Badge), `VTypography` (Title/Excerpt)].

### 5. VTreeItem

A node-based item supporting hierarchy and status lights.

* **Features**: Includes specialized feedback like "Solidity Lights" for grounded data.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Bare Layouts.** Always use `VBox` for the container and `VCluster` / `VStack` for internal alignment.
> **Rule 2: Group Hover.** For secondary actions (e.g., a delete button), use Tailwind's `group` class on `VBox` and `opacity-0 group-hover:opacity-100` on the button.
> **Rule 3: Semantic Active State.** Use the `active` variant to automatically switch background and text colors to the primary theme.

### Standard Implementation Pattern

```vue
<VBox
  tag="li"
  padding="sm"
  rounded
  clickable
  :active="isActive"
  class="group"
>
  <VCluster justify="between" align="center">
    <VCluster gap="sm" class="min-w-0 flex-1">
      <VIcon name="Document" size="sm" />
      <VTypography size="sm" truncate>{{ label }}</VTypography>
    </VCluster>
    <VButton
      variant="ghost"
      size="xs"
      iconOnly
      iconName="Trash"
      class="opacity-0 group-hover:opacity-100"
    />
  </VCluster>
</VBox>

```

---

## 📂 Directory Structure

We categorize these under `navs` to align with the core functional categories.

```text
src/components/molecules/navs/
├── VNavListItem.vue     # Basic links
├── VTagListItem.vue     # Categorized items
├── VMetaListItem.vue    # Complex data items
├── VTimelineItem.vue    # Chronological items
├── VTreeItem.vue        # Hierarchical nodes
├── VActionListItem.vue  # Items with explicit triggers
└── README.md            # You are here

```

# Organisms: Layout Components

Layout Organisms define the high-level structural areas of the application. They manage the orchestration of scrolling, sticky headers, and the distribution of content across panels.

## 🧭 Design Principles

* **Slot-Centric Design**: Organisms should focus on the *where* (layout slots) rather than the *what* (content). They provide the shell that molecules live in.
* **Encapsulated Scrolling**: Each organism is responsible for its own scroll behavior (e.g., sticky headers in `BaseSidebarLayout`).
* **Zero Margin Bleed**: Organisms never impose external margins. They are always `h-full` or `w-full` to fill the slot provided by a Template.
* **Attribute Reconciliation**: Organisms are the final gatekeepers for CSS classes. They must flatten incoming attributes from templates before passing them down to atoms.

---

## 🛠 Component Catalog

### 1. BaseSidebarLayout

The foundation for all vertical panels (Sidebars, Master Lists, Drawers).

* **Capabilities**: Sticky headers, scrollable body with `scrollbar-gutter: stable`, and optional footers.
* **Architecture**: `Box[Aside]` > (`Box[Header]`, `Box[Body/Scroll]`, `Box[Footer]`).

### 2. MasterListPanel

An abstraction of `BaseSidebarLayout` specifically optimized for the "Master" side of a Master-Detail interface.

* **Business Logic**: Includes built-in support for "New Entry" buttons and "Item Count" indicators.
* **Layout Rule**: Enforces a `p-2` (padding="xs") internal container and a `Stack` for list items to ensure uniform vertical rhythm.

### 3. HeaderNavigation (Pending)

Manages the top-level application identity and global actions.

* **Composition**: `Cluster` > [`Logo`, `Breadcrumbs`, `UserActions`].

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Prop Drilling for Styles.** Do not use `bodyClass` props. Use `v-bind="$attrs"` and `inheritAttrs: false` to apply classes to the internal content container.
> **Rule 2: Sticky Hierarchy.** Headers must always be `sticky top-0` and have a higher `z-index` than the body content to ensure they stay visible during scrolling.
> **Rule 3: Empty State Handling.** Always provide a named `#empty-state` slot to handle zero-data scenarios gracefully within the layout.

### Standard Layout Orchestration Pattern

```vue
<BaseSidebarLayout>
  <template #header>
     </template>

  <template #body>
    <Box padding="xs" v-bind="$attrs">
      <Stack gap="sm">
        <slot name="items" />
      </Stack>
    </Box>
  </template>
</BaseSidebarLayout>

```

---

## 📂 Directory Structure

```text
src/components/organisms/layout/
├── BaseSidebarLayout.vue    # The Structural Engine
├── MasterListPanel.vue      # Business-Logic Wrapper
└── README.md                # You are here

```

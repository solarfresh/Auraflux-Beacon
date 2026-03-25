# Molecules: Navs

Navigation molecules manage the application’s information architecture, hierarchy, and user focus. By combining **Bootstrap Navs** (Tabs, Groups, Alerts) and **Material Design** interaction principles, these components facilitate seamless movement between data entities and workspaces.

## 🧭 Design Principles

* **Directional Clarity**: Active states (for Tabs and List Items) and Chevrons (for Groups) must clearly communicate the user's current location and expansion state.
* **Structural Containment**: All navigation clusters must use **Atoms** (`VBox`, `VStack`, `VCluster`) to ensure spacing tokens are strictly enforced.
* **State Synchronization**: Use `v-model` for components with toggleable or selectable states (like `VNavTabs` and `VNavGroup`) to keep the UI in sync with the application logic.
* **Content Prioritization**: Critical information should be surfaced via high-contrast directors like `VNavAlert`.

---

## 🛠 Component Catalog

### 1. VNavTabs

A tabbed interface for switching between concurrent views within a single panel.

* **Bootstrap Ref**: Equivalent to `.nav-tabs`.
* **Composition**: `VBox` > `VCluster` > [`VButton` (Tab Style)].

### 2. VNavGroup

A structural wrapper for grouping related list items.

* **Bootstrap Ref**: Similar to `.accordion` or `.list-group`.
* **Features**: Supports `collapsible` mode and theme-based headers.

### 3. VNavAlert

A high-level banner that surfaces items requiring user intervention across sections.

* **Composition**: `VBox` > `VCluster` > [`VIcon`, `VTypography`, `VBadge`].

### 4. VActionListItem

A specialized navigation item designed for **explicit triggers**.

* **Composition**: `VBox` > `VCluster` > [`VIcon`, `VTypography`, `VIcon` (Chevron/Action)].
* **Logic**: Usually indicates that clicking will open a deeper level or a modal (e.g., Scope criteria with rationale).

### 5. VNavListItem (Standard)

The base unit for navigation links, optimized for high-density lists.

* **Variants**: `Tag`, `Meta`, `Timeline`, `Tree`.

### 6. VWelcomeGateway

The **Psychological Airbridge**. A specialized entry portal designed to transition users from the landing page to the active workspace by capturing their initial cognitive intent.

* **Composition**: `VBox` > `VStack` > [`VTypography` (Greeting), `VCluster` > `VButton` (Intent Tags), `VButton` (Launch)].
* **Responsibility**: High-signal orientation. It ensures the user pauses to define their focus (Exploratory, Structural, Decision-focused) before session initialization.
* **Key Features**:
    * **Dynamic Greeting**: Supports system-rotated or personalized welcome messages.
    * **Intent Signaling**: Uses `VButton` as radio-style tags to capture session metadata.
    * **Action Locking**: The "Start Session" trigger is logically disabled until an intent is selected, enforcing "High-Quality Friction."

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Bare Layouts.** Always use `VStack` for vertical lists and `VCluster` for horizontal tabs or headers.
> **Rule 2: Responsive Safeguards.** Navigation items must handle long text via `truncate` and ensure parents have `min-w-0` to prevent layout overflow.
> **Rule 3: ARIA Standards.** `VNavTabs` must manage `aria-selected` and `role="tab"` to maintain accessibility.
> **Rule 4: Intent-First Navigation.** For `VWelcomeGateway`, the "Launch" action must be functionally dependent on an intent selection. Never allow a "blind launch" without metadata.
> **Rule 5: Atomic Purity.** All text within navigation molecules—including sub-labels and button text—must be wrapped in `VTypography` to ensure global design token synchronization. Raw `<span>` or `<p>` tags are prohibited.
> **Rule 6: Focus Minimalis.** When `VWelcomeGateway` is active, it must maintain the highest signal-to-noise ratio in the viewport. Avoid placing it near high-density list molecules like `VNavGroup`.

### Standard Composition Pattern

```vue
<VActionListItem
  label="Inclusion Criteria"
  description="Verified by AI"
  @click="openDetails"
>
  <template #action>
    <VIcon name="ChevronRight" size="sm" class="text-slate-400" />
  </template>
</VActionListItem>

```

---

## 🎨 Layout & State Tokens

| Relationship | Logic | Token |
| --- | --- | --- |
| **Active Tab/Item** | Primary Focus | `text-indigo-600 border-b-2 border-indigo-600` |
| **Hover State** | Feedback | `hover:bg-slate-50` |
| **Internal Gap** | Tight grouping | `gap="xs"` (8px) |
| **External Gap** | Block separation | `gap="md"` (16px) |
| **Intent Selected** | High Focus / Active | `variant="primary"` (Solid Fill) |
| **Intent Pending** | Secondary Choice | `variant="outline"` (Ghost Border) |
| **Gateway Padding** | Hero Centering | `padding="xl"` (32px+) |
| **Gateway Width** | Readability | `max-w-3xl` (Approx. 768px) |

---

## 📂 Directory Structure

```text
src/components/molecules/navs/
├── VNavTabs.vue         # Tabbed switching (was TabbedPanel)
├── VNavGroup.vue        # Structural grouping (was SectionGroup)
├── VNavAlert.vue        # Contextual redirect (was UnifiedReviewAlert)
├── VActionListItem.vue  # Items with explicit triggers (was ScopeListItem)
├── VNavListItem.vue     # Base link (Standard)
├── VTagListItem.vue     # Status-colored items
├── VMetaListItem.vue    # Complex metadata items
├── VTimelineItem.vue    # Chronological items
├── VTreeItem.vue        # Hierarchical nodes
├── VWelcomeGateway.vue  # Intent-based entry portal
└── README.md            # You are here

```

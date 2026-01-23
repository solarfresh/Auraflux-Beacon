# Molecules: List Items

List Items are repetitive building blocks used to represent data entities within sidebars, feeds, or search results. They translate raw data into interactive, status-aware rows.

## 🧭 Design Principles

* **Visual Density**: Items must remain compact (baseline `p-2` or `p-3`) to allow users to scan large sets of data.
* **Semantic Signaling**: Use color tokens and icons (e.g., Solidity Lights, Entity Status colors) to communicate data quality at a glance.
* **Hover Affordance**: All list items must provide a subtle background shift on hover to indicate they are interactive.
* **Action Encapsulation**: Secondary actions (like "Edit" or "Delete") are hidden by default and revealed via `group-hover`.

---

## 🛠 Component Catalog

### 1. SidebarNodeItem

A complex navigation molecule for the Conceptual Map.

* **Key Features**: Implements **Anti-Hallucination Jitter** for low-groundedness data and **Solidity Lights** for evidence-backed nodes.
* **Interactions**: Supports `select`, `hover`, and `teleport` (quick navigation) events.

### 2. KeywordListItem

Visualizes the status of specific research keywords.

* **States**: Maps `LOCKED` (Indigo), `AI_EXTRACTED` (Yellow), and `ON_HOLD` (Gray) statuses.
* **Composition**: `Icon` + `Text` (Label & Subtext) + `Button[xs]`.

### 3. FocusItem

A "Metadata Card-let" used to display core research parameters (e.g., Research Goals).

* **Composition**: `Text` (Uppercase Label) + `Text` (Value) + `Icon` (Edit hint).
* **Behavior**: Emphasizes the relationship between the field name and its content.

### 4. ScopeListItem

A horizontal row for defining research boundaries and rationales.

* **Logic**: Shares status mapping with `KeywordListItem` but optimizes for long strings of text using `truncate`.

### 5. ViewListItem

A structural navigation item for switching perspectives or workspaces.

* **Style**: Uses a bold `isActive` state with a dedicated indicator dot and `indigo` highlights.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Truncation First.** Titles and rationales must use the `truncate` utility class combined with `min-w-0` on parent containers to prevent layout breaking.
> **Rule 2: Icon Consistency.** Always use **PascalCase** for icon names (e.g., `ChevronRight`, `Sparkles`).
> **Rule 3: Micro-Actions.** Use `Button` with `size="xs"` for all secondary actions within the row to maintain the 40px - 48px height footprint.

### Standard Row Layout Pattern

```vue
<li class="group flex items-center p-3 rounded-md transition hover:bg-gray-50">
   <Icon class="flex-shrink-0 mr-3" />
   <div class="flex-1 min-w-0">
      <Text weight="bold" class="truncate" />
      <Text size="xs" color="gray-500" />
   </div>
   <Button variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100" />
</li>

```

---

## 📂 Directory Progress

```text
src/components/molecules/list-items/
├── FocusItem.vue
├── KeywordListItem.vue
├── ScopeListItem.vue
├── SidebarNodeItem.vue
├── ViewListItem.vue
└── README.md              # You are here

```

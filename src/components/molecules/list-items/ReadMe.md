# Molecules: List Items

List Items are repetitive building blocks used to represent data entities within sidebars, feeds, or search results. They translate raw data into interactive, status-aware rows.

## 🧭 Design Principles

* **Visual Density**: Items must remain compact (baseline `p-2` or `p-3`) to allow users to scan large sets of data.
* **Semantic Signaling**: Use color tokens, **Badges**, and **Icons** to communicate data quality, source types, and entity status at a glance.
* **Hover Affordance**: All list items must provide a subtle background shift or shadow transition on hover to indicate they are interactive.
* **Action Encapsulation**: Secondary actions (like "Edit" or "Delete") are hidden by default and revealed via `group-hover` to reduce visual noise.

---

## 🛠 Component Catalog

### 1. KeywordListItem

Visualizes the status of specific research keywords.

* **States**: Maps `LOCKED` (Indigo), `AI_EXTRACTED` (Amber), and `ON_HOLD` (Gray) statuses.
* **Composition**: `Icon` + `Text` (Label) + `Button[xs]`.

### 2. ScopeListItem

A horizontal row for defining research boundaries (Inclusions/Exclusions) and rationales.

* **Logic**: Optimizes for longer strings of text using `truncate` and `line-clamp`.
* **Composition**: `Badge` (Status) + `Text` (Boundary description).

### 3. ResourceListItem

Represents collected research materials like PDFs, URLs, or Academic papers.

* **Key Features**: Supports **Drag & Drop** via `draggable="true"`.
* **Metadata**: Displays `sourceType` (e.g., Academic, Social) and `format` (e.g., PDF, URL) using semantic **Badges**.
* **Indicators**: Shows a dedicated `Icon` if `userNotes` are present.

### 4. SidebarNodeItem

A complex navigation molecule for the Conceptual Map.

* **Key Features**: Implements **Anti-Hallucination Jitter** for low-groundedness data and **Solidity Lights** for evidence-backed nodes.

### 5. ViewListItem

A structural navigation item for switching perspectives or workspaces.

* **Style**: Uses a bold `isActive` state with `indigo` highlights.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Truncation First.** Titles and rationales must use the `truncate` utility class combined with `min-w-0` on parent containers to prevent layout breaking.
> **Rule 2: Summary Clamping.** Use `line-clamp-2` for AI-generated summaries to maintain a consistent vertical footprint across lists.
> **Rule 3: Drag & Drop.** For `ResourceListItem`, ensure the `handleDragStart` method correctly serializes the resource object into `application/json` or a custom format for the Canvas.

### Standard Resource Row Pattern

```vue
<li class="group flex flex-col p-3 border rounded-lg hover:shadow-md transition">
   <div class="flex justify-between items-start">
      <Text weight="bold" class="truncate" />
      <Button variant="ghost" size="xs" class="opacity-0 group-hover:opacity-100" />
   </div>
   <div class="flex gap-1 mt-1">
      <Badge variant="indigo" size="xs">{{ sourceType }}</Badge>
      <Badge variant="gray" size="xs">{{ format }}</Badge>
   </div>
</li>

```

---

## 📂 Directory Progress

```text
src/components/molecules/list-items/
├── KeywordListItem.vue
├── ResourceListItem.vue   # Added: Supports drag & drop + Source/Format badges
├── ScopeListItem.vue
├── SidebarNodeItem.vue
├── ViewListItem.vue
└── README.md              # You are here

```

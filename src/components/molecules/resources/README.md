# Molecules: Resources

Resource molecules are **"Data-to-UI Converters"**. They represent the persisted entities of the Auraflux ecosystem (Projects, Agents, Nodes, Keywords). These components bridge the gap between a raw JSON object from the API and a highly interactive, semantically rich interface.

## 🧭 Design Principles

* **Entity Representation**: Every component in this directory must map to a specific domain entity (e.g., `VProjectCard` ↔ `Project`).
* **The "Flat Skin" Architecture**: To maintain performance and flexibility, **do not** use a `VCardBase`. Instead, use `VBox` as the root "Skin" and configure its props directly.
* **Predictable Interaction**: All resource cards must support a `clickable` state, providing tactile feedback (`active:scale-[0.98]`) and focus-visible rings for accessibility.
* **Semantic Border Logic**:
    * **Solid**: Verified, human-curated, or stable data.
    * **Dashed**: System-suggested, AI-generated drafts, or functional placeholders.

---

## 🛠 Component Catalog

### 1. VProjectCard (The Workspace Entry)
The primary entry point for research workspaces.
* **Physical Layer**: `VBox` (Root) > `VStack` > [`VCluster` (Header), `VTypography` (Content), `VSpacer`, `VCluster` (Metadata)].
* **Responsibility**: Displaying project health, AI-suggestion status, and metadata tags.
* **Key Props**: `project` (Project Object).

### 2. VInteractivePlaceholder (The Invitation)
A structural invitation for user input, signaling "available capacity" within a grid or list.
* **Physical Layer**: `VBox` (Dashed) > `VStack` > [`VIcon`, `VTypography` (Label)].
* **Responsibility**: Standardizing the "Add New" pattern across all resource types.
* **Key Props**: `iconName`, `label`, `clickable`.

### 3. VEntityChip (The Metadata Tag)
A dense, interactive representation of keywords, research scopes, or identified concepts.
* **Physical Layer**: `VBox` > `VCluster` > [`VIcon`, `VTypography`, `VButton` (iconOnly)].
* **Design Intent**: Uses `group-hover` to reveal management actions (like removal) to reduce visual noise.
* **Key Props**: `label`, `iconName`, `removable`.

### 4. VStatusCard (The Structural Shell)
A generic resource card used for simple data displays that don't yet have a specialized business molecule.
* **Composition**: `VAlert` > `VStack` > `VCluster`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Over-Abstraction.** Strictly follow the **"No CardBase"** policy. Use `VBox` directly at the root of every resource card to ensure props like `padding` and `hoverBackground` remain easily adjustable.
> **Rule 2: Responsive Content.** Always use `VTypography` with the `line-clamp` utility for descriptions to prevent card height misalignment in `VGrid` layouts.
> **Rule 3: State-Driven Identity.** If a resource is AI-generated (e.g., `project.status === 'AI_SUGGESTED'`), the root `VBox` **must** use `border="dashed"` and `background="amber-50"`.
> **Rule 4: Metadata Threshold.** Resource cards should never display more than 3 tags/chips simultaneously. Use a "+N" counter for overflow to maintain visual balance.
> **Rule 5: Actionable Consistency.** All resource cards must pass `:clickable="true"` to their root `VBox` to inherit the system-wide interaction behaviors.

### Standard Implementation Pattern

```vue
<VProjectCard :project="activeProject" />

<VInteractivePlaceholder
  label="Create New Agent"
  icon-name="UserPlus"
  @click="handleCreate"
/>
```

---

## 📂 Directory Structure

```text
src/components/molecules/resources/
├── VProjectCard.vue            # Business: Project entity tile
├── VEntityChip.vue             # Business: Metadata/Keyword tag
├── VInteractivePlaceholder.vue # Navigation: Actionable creation prompt
├── VStatusCard.vue             # Generic: Data-driven status shell
└── README.md                   # You are here
```

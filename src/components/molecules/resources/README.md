# Molecules: Resources

Resource molecules are **"Data-to-UI Converters"**. They represent the persisted entities of the Auraflux ecosystem (Projects, Agents, Nodes, Keywords). These components bridge the gap between a raw JSON object from the API and a highly interactive, semantically rich interface.

## 🧭 Design Principles

* **Entity Representation**: Every component in this directory must map to a specific domain entity (e.g., `VProjectCard` ↔ `Project`).
* **The "Flat Skin" Architecture**: To maintain performance and flexibility, **do not** use a `VCardBase`. Instead, use `VBox` as the root "Skin" and configure its props directly.
* **Predictable Interaction**: All resource cards must support a `clickable` state, providing tactile feedback (`active:scale-[0.98]`) and focus-visible rings for accessibility.
* **Semantic Border Logic**:
    * **Solid**: Verified, human-curated, or stable data.
    * **Dashed**: System-suggested, AI-generated drafts, or functional placeholders.
* **Layout Sovereignty**: Molecules with complex internal controls (like Toolbars) must not use custom CSS for spacing. Use nested `VCluster` for alignment and constrained `VBox` atoms (e.g., `width="px"`) for visual dividers to maintain **Atomic Physicality**.
* **Prompt Transparency**: Uses `line-clamp-2` to provide a "peek" into the `system_prompt`, allowing architects to distinguish between agents with similar names but different instructional logic.
* **Model Distinction**: Specifically highlights the `modelType` (e.g., Gemini, GPT-4) as a primary metadata chip to signal the agent's underlying "cognitive" cost and capability.
* **Role-Based Styling**: Automatically maps the `agent.name` or `agent.role` to specific visual treatments to help users differentiate between "Explorers" (Initiation phase) and "Refiners" (Focusing phase) within the Kuhlthau ISP model.

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

#### 5. VProjectToolbar (The Dimension Controller)
A specialized orchestrator that manages the visibility and sequence of a resource collection.
* **Physical Layer**: `VBox` (Root/Sticky) > `VCluster` > [`VBox` (Segmented Group), `VCluster` (Sort + Action)].
* **Responsibility**: Mapping the **Resource Lifecycle** (All/Active/Archived) and **Temporal Hierarchy** (Recently Edited/Created) to the active view.
* **Key Props**: `modelValue` (Object with `filter` & `sort`), `v-model`.

### **6. VAgentCard (The Autonomous Blueprint)**
A specialized entity tile that visualizes the configuration, operational role, and behavioral constraints of an AI Agent.
* **Physical Layer**: `VBox` (Root) > `VStack` > [`VCluster` (Header: Icon & Status), `VStack` (Identity & Prompt Snippet), `VCluster` (Metadata: Model & Role)].
* **Responsibility**: Translating complex LLM configurations (System Prompts, Model Parameters) into a scannable interface for agent orchestration.
* **Key Props**: `agent` (Agent Object conforming to `Agent` Interface).

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Over-Abstraction.** Strictly follow the **"No CardBase"** policy. Use `VBox` directly at the root of every resource card to ensure props like `padding` and `hoverBackground` remain easily adjustable.
> **Rule 2: Responsive Content.** Always use `VTypography` with the `line-clamp` utility for descriptions to prevent card height misalignment in `VGrid` layouts.
> **Rule 3: State-Driven Identity.** If a resource is AI-generated (e.g., `project.status === 'AI_SUGGESTED'`), the root `VBox` **must** use `border="dashed"` and `background="amber-50"`.
> **Rule 4: Metadata Threshold.** Resource cards should never display more than 3 tags/chips simultaneously. Use a "+N" counter for overflow to maintain visual balance.
> **Rule 5: Actionable Consistency.** All resource cards must pass `:clickable="true"` to their root `VBox` to inherit the system-wide interaction behaviors.
> **Rule 6: Physical Segment Control.** Segmented controls must be wrapped in a `VBox` with `background="slate-50"` and `rounded="lg"`. The active state should use `bg-white` and `shadow-sm` to create a tactile, physical "raised" effect.
> **Rule 7: Standardized Dividers.** Do not use `VLayoutDivider`. To create vertical separation within a toolbar, use a constrained `VBox`: `<VBox width="px" height="4" class="bg-slate-200" />`.
> **Rule 8: Direct Slot Usage.** Avoid deep prop drilling for button labels in the toolbar. Use `v-for` with a local `filterOptions` array to keep the template clean and maintainable.
> **Rule 9: Instruction Preview Integrity.** For `VAgentCard`, the `systemPrompt` preview must be rendered using `VTypography` with `color="slate-400"` to differentiate "Instructional Metadata" from "User Content."
> **Rule 10: Model Labeling.** Every Agent card must display its `llmParameters.model` within a secondary `VBox` tag to ensure technical accountability in the multi-agent orchestration view.

### Standard Implementation Pattern

```vue
<VProjectToolbar
  v-model="toolbarState"
  @create="handleNewProject"
/>

<VProjectCard :project="activeProject" />

<VInteractivePlaceholder
  label="Create New Agent"
  icon-name="UserPlus"
  @click="handleCreate"
/>

<VAgentCard :agent="explorerAgent" />

<VAgentCard
  :agent="suggestedRefiner"
  status="USER_DRAFT"
/>
```

---

## 📂 Directory Structure

```text
src/components/molecules/resources/
├── VProjectCard.vue            # Business: Project entity tile
├── VAgentCard                  # Business: Agent entity tile
├── VProjectToolbar.vue         # Business: Filter & Sort orchestrator
├── VEntityChip.vue             # Business: Metadata/Keyword tag
├── VInteractivePlaceholder.vue # Navigation: Actionable creation prompt
├── VStatusCard.vue             # Generic: Data-driven status shell
└── README.md                   # You are here
```

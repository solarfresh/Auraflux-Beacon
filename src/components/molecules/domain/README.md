# Molecules: Domain Specifics

Domain molecules are the **"Cognitive Translators"** of Auraflux. Unlike generic feedback or resource cards, these components encapsulate specific business logic, research methodology (ISP), and AI-assisted decision-making frameworks. They bridge raw data with the user's mental model of the research process.

## 🧭 Design Principles

* **Methodological Alignment**: Components must strictly reflect the terminology and stages of their respective frameworks (e.g., Kuhlthau’s ISP or Estuarine Framework).
* **AI-Enhanced Transparency**: When a status is derived from an LLM (e.g., Feasibility), the component must visually distinguish itself using the `amber` (Warning) semantic tone to signal "AI-generated/Review required."
* **Actionable States**: Domain components should not just be "labels." They should act as entry points to deeper analysis (e.g., clicking an `ISPStepCard` to refine a search query).

---

## 🛠 Component Catalog

### 1. VISPStepCard (The Navigator)
A specialized molecule designed to orient users within the core stages of the **Information Search Process**.
* **Physical Layer**: `VBox` > `VStack` > [`VBox` > `VIcon`, `VStack` > `VTypography` (Label + Sub-label)].
* **Responsibility**: Translates abstract ISP stages (Define, Connect, Act) into a visual "mental map."
* **Key Props**: `label`, `subLabel`, `isActive`, `isCompleted`.

### 2. VFeasibilityStatus (Data Quality)
Bridges the gap between AI-driven research results and visual confidence feedback.
* **Physical Layer**: `VStatusCard`.
* **Responsibility**: Automatically converts `HIGH` / `MEDIUM` / `LOW` enums into appropriate semantic colors (`emerald`, `amber`, `red`) and icons.
* **Usage**: Research result summaries and topic stability reports.

### 3. VEntityProjectStatus (Lifecycle)
Communicates the "Administrative" and "Operational" state of a system resource.
* **Physical Layer**: `VStatusCard`.
* **Responsibility**: Manages visual representations for lifecycle states such as `LOCKED`, `AI_EXTRACTED`, and `ON_HOLD`.

### 4. VReflectionStatus (Persistence Logic)
Specialized feedback for the **Reflection Log** system, tracking the transition from internal thought to committed data.
* **Logic**: Distinguishes between `draft` (Warning/Amber) and `committed` (Success/Emerald) states.
* **Composition**: Uses `VStatusCard` as the structural shell.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Methodology over Generic UI.** Never use a generic `VAlert` for ISP stages. Always use `VISPStepCard` to ensure the "Cognitive Navigator" visual language remains consistent.
> **Rule 2: Dual-Channel Stage Signaling.** Use **Solid** `VIcon` types for the *active* domain stage and **Outline** types for *future/inactive* stages.
> **Rule 3: AI Attribution.** Any status derived from an LLM calculation (like Feasibility) **must** default to the `amber` variant unless human-verified.
> **Rule 4: Domain Prop Mapping.** Avoid passing raw strings for status. Use TypeScript Enums/Types defined in `@/interfaces/domain` to ensure the mapping to icons and colors is centralized within the component.

### Standard Implementation Pattern

```vue
<VCluster gap="md">
  <VISPStepCard
    label="Define"
    sub-label="Clarify Anxiety"
    icon="MagnifyingGlass"
    :is-active="currentStage === 'DEFINE'"
  />
</VCluster>

<VFeasibilityStatus
  :status="analysis.score"
  :description="analysis.rationale"
/>
```

---

## 📂 Directory Structure

```text
src/components/molecules/domain/
├── VISPStepCard.vue          # ISP Methodology Navigator
├── VFeasibilityStatus.vue    # AI Result confidence mapping
├── VEntityProjectStatus.vue # Lifecycle state (Locked/Extracted)
├── VReflectionStatus.vue     # Reflection Log persistence states
└── README.md                 # You are here
```

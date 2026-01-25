# Molecules: Indicators

Indicator molecules are functional clusters designed to provide feedback, display status, or manage high-priority user tasks. They represent the **"Observer"** layer of our UI, ensuring the application remains transparent by mapping system data to human-readable semantic tones.

## 🧭 Design Principles

* **Dual-Channel Feedback**: Never rely on color alone to communicate status. Always pair semantic colors with specific icons (e.g., `LockClosed` for info) to ensure accessibility for color-blind users.
* **Contextual Layering**: Overlays must use the highest **Material Elevation** tokens (`shadow-xl`) and `backdrop-blur` to separate contextual tasks from the main content.
* **Bootstrap Semantic Mapping**:
* **Success**: `emerald` (Verified/Stable data).
* **Warning**: `amber` (AI-generated/Review required).
* **Danger**: `red` (Errors/Critical risks).
* **Info**: `indigo` (System status/Locked states).
* **Secondary**: `gray` (Drafts/Neutral states).



---

## 🛠 Component Catalog

This is the finalized **Component Catalog** for the `molecules/indicators/` directory. It reflects the architecture where **VAlert** acts as the semantic engine, **VStatusCard** provides the structural layout, and specialized components handle business logic.

### 1. VAlert

The **Atomic-Logic** foundation. It contains no layout rules (other than padding/rounded) but owns the entire semantic color system of the application.

* **Physical Layer**: `VBox`.
* **Responsibility**: Maps `variant` (success, info, etc.) to background and text tokens.
* **Key Props**: `variant`, `border`, `padding`, `rounded`.

### 2. VStatusCard

The **Structural Shell**. It dictates a specific UI pattern: a bold header with an icon followed by a body description.

* **Physical Layer**: `VAlert` > `VStack` > `VCluster`.
* **Responsibility**: Standardizes the "Alert Box" look across all sidebars and dashboards.
* **Key Props**: `variant`, `iconName`, `title`.

### 3. VFeasibilityStatus

A **Domain Specialist**. It bridges the gap between raw data and visual feedback.

* **Physical Layer**: `VStatusCard`.
* **Responsibility**: Automatically converts `HIGH` / `MEDIUM` / `LOW` enums into appropriate colors and icons.
* **Usage**: Research result summaries, Topic stability reports.

### 4. VEntityWorkflowStatus

A **Lifecycle Specialist**. It communicates the "Administrative" state of a resource.

* **Physical Layer**: `VStatusCard`.
* **Responsibility**: Manages the visual representation of `LOCKED`, `AI_EXTRACTED`, and `ON_HOLD`.
* **Usage**: Detail editors, sidebar status badges.

### 5. VModal

The **Contextual Master**. A high-focus overlay for critical tasks.

* **Physical Layer**: `VBox` (Backdrop) > `VBox` (Surface) > `VStack`.
* **Responsibility**: Handling z-index, accessibility (Esc key), and focus management.
* **Key Props**: `v-model:open`, `title`, `size`.

### 6. VOverlayLoader

The **Blocking Feedback**. Used when a specific container or the whole screen is waiting for an API response.

* **Physical Layer**: `VBox` > `VStack` > `VIcon` (Spinner).
* **Responsibility**: Preventing user interaction during "destructive" or "long-running" tasks.

### 7. VStatusScore

The **Quantitative Indicator**. Merges qualitative labels with quantitative bars.

* **Physical Layer**: `VStack` > `VTypography` + `VProgressSegment`.
* **Usage**: Confidence scores, search relevance, or completeness bars.

### 8. VStepProgress

The **Sequential Tracker**. Communicates progress through a multi-stage wizard.

* **Physical Layer**: `VCluster` > `VIcon` (Step Marker) + `VTypography`.
* **Usage**: Research initiation steps, Onboarding flows.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Composition over Duplication.** Never write raw Tailwind classes for status colors. Always wrap your content in `VAlert` or `VStatusCard`.
> **Rule 2: Icon Consistency.** Use **Solid** Heroicons for status indicators to ensure visual weight is consistent with the bold typography.
> **Rule 3: Business Logic Boundary.** Domain-specific logic (e.g., mapping `LOCKED` to `indigo`) belongs in `VEntityWorkflowStatus`, not in the base `VStatusCard`.

### Standard Implementation Pattern

```vue
<VFeasibilityStatus
  :status="keyword.feasibility"
  :description="keyword.rationale"
/>

<VEntityWorkflowStatus :status="keyword.entityStatus">
  <template #default>
    This keyword is currently locked by the administrator.
  </template>
</VEntityWorkflowStatus>

```

---

## 📂 Directory Structure

```text
src/components/molecules/indicators/
├── VAlert.vue                # Base semantic container (Atoms-plus)
├── VStatusCard.vue           # Standardized layout (Icon + Title + Body)
├── VFeasibilityStatus.vue    # Business: Data quality (was ResearchValidation)
├── VEntityWorkflowStatus.vue # Business: Lifecycle (Locked/Draft)
├── VModal.vue                # High-focus dialog (Overlay)
├── VOverlayLoader.vue        # Blocking state feedback
├── VStatusScore.vue          # Text + Progress bar (was TopicStatusIndicator)
├── VStepProgress.vue         # Multi-stage workflow tracker
└── README.md                 # You are here

```

# Molecules: Indicators

Indicators (formerly Feedback) are functional clusters composed of display atoms. They provide users with real-time information about system progress, data validity, and process status.

## 🧭 Design Principles

* **Dual-Channel Signaling**: Always pair semantic colors with icons. Never rely on color alone to convey meaning (Accessibility Rule).
* **Semantic Tones**:
* **Success**: `emerald` (Verified/Stable)
* **Warning**: `amber` (AI-Generated/Pending)
* **Danger**: `red` (Error/High Risk)


* **Visual Hierarchy**: Use `VBox` to create containment for high-priority feedback (like Status Cards) and `VStack` for localized inline feedback.

---

## 🛠 Component Catalog

### 1. VStatusCard

A composite alert or summary box for data validation.

* **Composition**: `VBox` > `VStack` > [`VCluster` (Icon + Title), `VTypography` (Description)].
* **Bootstrap Ref**: Equivalent to `.alert` with custom content.

### 2. VOverlayLoader

A global or container-level loading state.

* **Composition**: `VBox` (Backdrop) > `VStack` > [`VIcon` (Spinning), `VTypography` (Message)].

### 3. VStatusScore

A localized indicator combining text and progress.

* **Composition**: `VStack` > [`VTypography` (Label), `VProgressSegment`].

### 4. VStepProgress

A workflow tracker for multi-stage processes.

* **Composition**: `VCluster` > [`VIcon` (Step Status), `VTypography` (Step Name)].

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Icon Enforced.** Every `VStatusCard` or `VStatusScore` must receive an `iconName` prop to ensure color-blind accessibility.
> **Rule 2: Animation Constraints.** Limit `animate-spin` to loading icons. Do not use excessive animations that may distract from content.
> **Rule 3: Read-Only.** These components should not trigger business logic; they only reflect existing state.

### Standard Implementation Pattern

```vue
<VStatusCard
  variant="success"
  title="Grounded Content"
  icon-name="ShieldCheck"
>
  <VTypography size="sm">
    This research topic is backed by 5+ verified sources.
  </VTypography>
</VStatusCard>

```

---

## 📂 Directory Structure

We group these under `indicators` to mirror the Atom-level structure, ensuring a predictable developer experience.

```text
src/components/molecules/indicators/
├── VStatusCard.vue      # (was ResearchValidation)
├── VStatusScore.vue     # (was TopicStatusIndicator)
├── VStepProgress.vue    # (was ProgressTracker)
├── VOverlayLoader.vue   # (was FullScreenLoader)
└── README.md            # You are here

```

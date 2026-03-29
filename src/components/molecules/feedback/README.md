# Molecules: Feedback

Feedback molecules are the **"System's Voice."** Unlike Resource molecules that represent persistent data, or Domain molecules that track methodologies, Feedback components are **stateless observers**. Their sole responsibility is to provide immediate, human-readable reactions to system events, background processes, or user actions.

## 🧭 Design Principles

* **Stateless Response**: Feedback molecules must never "own" or "persist" business data. They function as **pure visual transformers** that receive a status (e.g., `loading`, `success`, `error`) and render the corresponding UI signal.
* **Dual-Channel Feedback**: Never rely on color alone to communicate status. Always pair semantic colors with specific icons (e.g., `CheckCircle` for success, `ExclamationTriangle` for warning) to ensure accessibility for color-blind users and maintain visual weight.
* **Contextual Layering**: High-priority feedback (like `VModal` or `VOverlayLoader`) must use the highest **Material Elevation** tokens (`shadow-xl`) and `backdrop-blur-sm` to physically separate the critical task from the underlying workspace.
* **Bootstrap-Aligned Semantics**:
    * **Success (`emerald`)**: Positive outcomes, data persistence, or verified AI outputs.
    * **Warning (`amber`)**: Action required, non-critical AI logic, or system-generated drafts.
    * **Danger (`red`)**: API failures, destructive confirmation, or high-risk errors.
    * **Info (`indigo`)**: System notifications, locked states, or neutral guidance.
    * **Secondary (`gray`)**: Inactive states, background tasks, or supplementary info.
* **Non-Intrusive Guidance**: Feedback should match the scale of the event. Use `VAlert` for inline updates, `VStatusCard` for persistent summaries, and `VModal` only for critical interruptions.

---

## 🛠 Component Catalog

### 1. VAlert (The Base Engine)
The **Atomic-Logic** foundation. It contains no complex internal layout but owns the entire semantic color system of the application.
* **Composition**: `VBox`.
* **Responsibility**: Mapping `variant` (success, info, etc.) to background and text tokens for inline notifications.
* **Key Props**: `variant`, `border`, `padding`, `rounded`.

### 2. VStatusScore (The Quantitative Indicator)
Merges qualitative labels with quantitative visual bars to represent AI certainty or progress.
* **Composition**: `VStack` > `VTypography` + `VProgressSegment`.
* **Usage**: Confidence scores, search relevance percentages, or task completeness bars.

### 3. VStepProgress (The Sequential Tracker)
A multi-stage visual guide that communicates progress through a defined workflow.
* **Composition**: `VCluster` > `VIcon` (Step Marker) + `VTypography`.
* **Usage**: Onboarding flows, multi-step research initiations, or wizard-style interfaces.

### 4. VEmptyState (The Zero-Data Navigator)
Handles the "Zero Data" scenario to prevent user disorientation and provide a clear starting point.
* **Composition**: `VStack` > [`VBox` > `VIcon`, `VTypography` (Title), `Slot` (Description), `Slot` (Actions)].
* **Key Props**: `icon`, `title`, `description`.

### 5. VModal (The Contextual Master)
A high-focus, blocking overlay for critical tasks or destructive confirmations.
* **Composition**: `VBox` (Backdrop) > `VBox` (Surface) > `VStack`.
* **Responsibility**: Managing z-index, backdrop-blur, and accessibility (Esc key/Focus management).
* **Key Props**: `v-model:open`, `title`, `size`.

### 6. VOverlayLoader (The Blocking Feedback)
A specialized state feedback used when a specific container or the entire screen is waiting for an async response.
* **Composition**: `VBox` (Semi-transparent) > `VStack` > `VIcon` (Spinner).
* **Responsibility**: Visually signaling "Processing" while preventing user input during long-running tasks.

### 7. VUserAvatar (The Identity Feedback)
A specialized molecule representing a user's presence and system status. It provides immediate visual feedback on connectivity and identity through initials or imagery.
* **Composition**: `VBox` > `img` | `VTypography` + `VBox` (Status Indicator).
* **Responsibility**: Gracefully handling image loading errors by falling back to name-based initials and displaying real-time presence (Online/Busy/Offline).
* **Key Props**: `src`, `name`, `size`, `status`.
* **Design Intent**: Uses `indigo-50` as a default background for empty states to maintain a soft, professional semantic tone.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Composition over Duplication.** Never write raw Tailwind `bg-*` or `text-*` classes for status colors. Always wrap content in `VAlert` or `VStatusCard` to ensure the semantic engine handles the tokens.
> **Rule 2: Stateless Purity.** Feedback components must not perform API calls or manage persistent data. They should only react to props (`loading`, `status`, `variant`) passed down from Organisms or Pages.
> **Rule 3: Icon Consistency.** Use **Solid** Heroicons for status indicators (Success, Warning, Danger) to ensure visual weight is consistent with the bold semantic typography.
> **Rule 4: Scale-to-Action.** Match the feedback scale to the event priority:
> * **Inline updates**: Use `VAlert`.
> * **Persistent status/Sidebars**: Use `VStatusCard`.
> * **Critical/Destructive interruptions**: Use `VModal`.
> **Rule 5: Focus & Accessibility.** All interactive feedback (especially `VModal`) must implement the `Esc` key listener and focus-trap logic. Overlays must include `backdrop-blur-sm` to maintain spatial hierarchy.
> **Rule 6: Zero-Data Guidance.** Always implement `VEmptyState` for list-based views. It must include at least one `slot` for an "Action Button" (e.g., `VButton`) to prevent user dead-ends.
> **Rule 7: Quantitative Integrity.** For `VStatusScore`, the progress bar color must automatically sync with the qualitative label (e.g., Score < 40% = `red`, > 80% = `emerald`).
> **Rule 8: Identity Fallback.** For `VUserAvatar`, always implement a robust initials-generation logic. If a `name` contains multiple parts (e.g., "Scott Huang"), extract the first and last initials ("SH") to ensure professional clarity when an image is missing.

---

### Standard Implementation Pattern

```vue
<VAlert variant="success" border="all" padding="sm">
  Project configuration saved successfully.
</VAlert>

<VStatusScore
  label="AI Confidence"
  :value="92"
  variant="emerald"
/>

<VOverlayLoader v-if="isProcessing" label="Analyzing Research Data..." />
```

---

## 📂 Directory Structure

```text
src/components/molecules/feedback/
├── VAlert.vue            # Base semantic engine (Atoms-plus)
├── VEmptyState.vue         # Navigation: Zero-data guidance
├── VModal.vue            # High-focus contextual overlay
├── VOverlayLoader.vue    # Blocking state/Async feedback
├── VStatusScore.vue      # Quantitative indicator (Text + Progress)
├── VStepProgress.vue     # Sequential workflow tracker
├── VUserAvatar.vue         # Identity: Profile & Presence feedback
└── README.md             # You are here
```

# Molecules: Feedback

Feedback molecules provide users with information about the system's current state, progress, or the validity of data. They ensure the application remains transparent and responsive to user actions.

## 🧭 Design Principles

* **Semantic Consistency**: Use standardized color sets to convey meaning:
* **Success/Stable**: `emerald` (High grounding or feasibility)
* **Warning/Review**: `amber` (AI-extracted or medium feasibility)
* **Danger/Critical**: `red` (Low feasibility or connection errors)


* **Visual Anchors**: Always pair status colors with icons to ensure accessibility for color-blind users.
* **Non-Blocking vs. Blocking**: Distinguish between localized feedback (e.g., `TopicStatusIndicator`) and global state blocking (e.g., `FullScreenLoader`).

---

## 🛠 Component Catalog

### 1. FullScreenLoader

A high-priority overlay that prevents user interaction during global transitions.

* **Composition**: `Icon` + `Text`.
* **Visuals**: Uses `backdrop-blur-md` to maintain context while focusing the user.

### 2. ResearchValidation

A status card used to display the feasibility or stability of a research topic.

* **Composition**: `Icon` + `Text` (Status) + `Text` (Rationale).
* **Usage**: Best for summary panels or "Check-point" reviews during the refinement process.

### 3. TopicStatusIndicator

A localized indicator for specific research entities.

* **Composition**: `Text` + `BarSegment`.
* **Logic**: Maps internal numeric scores to qualitative labels (e.g., "Stable", "Incomplete").

### 4. ProgressTracker

A structural molecule for tracking multi-stage workflows (e.g., Research Initiation).

* **Composition**: `Icon` + `Text` + `BarSegment`.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Accessible Color Blindness.** Never rely on color alone. Use the `CheckCircle` for high/stable, `QuestionMarkCircle` for medium/pending, and `ExclamationCircle` for low/critical.
> **Rule 2: Read-Only Intent.** Feedback molecules should not contain primary inputs. They are for reflection and observation.
> **Rule 3: Animation Utility.** Use `animate-spin` for loading icons and `animate-pulse` only for high-priority "live" status lights.

### Comparison of Status Tones

```vue
<ResearchValidation
  status="HIGH"
  description="Grounding is solid with 5+ citations."
/>

```

---

## 📂 Directory Progress

```text
src/components/molecules/feedback/
├── FullScreenLoader.vue     # Global block state
├── ProgressTracker.vue      # Workflow progress
├── ResearchValidation.vue   # Data quality alert
├── TopicStatusIndicator.vue # Localized status
└── README.md                # You are here

```

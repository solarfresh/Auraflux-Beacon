# Molecules: Feedback

Feedback molecules provide users with information about the system's current state, progress, or the result of an action. They are essential for a responsive and transparent user experience.

## 🧭 Design Principles

* **Non-Blocking vs. Blocking**: Distinguish clearly between feedback that blocks interaction (e.g., `FullScreenLoader`) and feedback that is purely informative (e.g., `TopicStatusIndicator`).
* **Visual Hierarchy**: Use size and color to denote the importance of the feedback (e.g., indigo for progress, green for success).
* **Clarity**: Always pair icons with descriptive text to ensure the context is understandable without visual-only cues.

---

## 🛠 Component Catalog

### 1. FullScreenLoader

A high-priority overlay that prevents user interaction during global loading states.

* **Composition**: `Icon` + `Text`.
* **Standardization**: Uses `backdrop-blur-md` to maintain spatial awareness while focusing on the task.

### 2. ProgressTracker

A horizontal bar for tracking workflow stages.

* **Composition**: `Icon` + `Text` + `BarSegment`.
* **Usage**: Best placed in page headers or fixed footers.

### 3. TopicStatusIndicator

A localized status bar for specific research entities.

* **Composition**: `Text` + `BarSegment`.
* **Logic**: Maps numeric scores to qualitative labels.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1:** Feedback components should be "Read-Only". They should not contain inputs or actionable buttons unless it's a "Retry" or "Cancel" action.
> **Rule 2:** Always use the `animate-spin` utility for loading icons to ensure consistent motion across the app.
> **Rule 3:** Use `gray-500` for "Detail" or "Secondary" text to keep the visual focus on the primary message.

---

## 📂 Directory Progress

```text
src/components/molecules/feedback/
├── FullScreenLoader.vue     # Global block state
├── ProgressTracker.vue      # Workflow progress
├── TopicStatusIndicator.vue # Stability indicator
└── README.md                # You are here

```

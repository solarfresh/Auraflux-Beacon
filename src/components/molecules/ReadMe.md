# Molecules: Functional Components

Molecules are groups of **Atoms** bonded together. They are the smallest fundamental units that can carry out a specific operational task (e.g., submitting a message, confirming an action, or tracking progress).

## 🧭 Design Contract

* **Atom Dependency**: Molecules must exclusively use components from `@/components/atoms`.
* **Standardized Sizing**: Always match sizes across sibling atoms (e.g., if an `Input` is `lg`, the sibling `Button` must be `lg`).
* **Prop Propagation**: Molecules should pass relevant states (like `isDisabled`) down to all child atoms to ensure visual consistency.
* **Layout**: Molecules use Flexbox or Grid to manage the spatial relationship between their atoms but should remain flexible in width.

---

## 🛠 Component Catalog

### 1. Interaction & Input

| Component | Composition | Purpose |
| --- | --- | --- |
| **MessageInput** | `Input` + `Button` + `Icon` | Primary chat/search entry. Supports `Enter` key and auto-trimming. |
| **ActionBar** | `Button` + `Text` | Sticky/fixed footer for critical workflow transitions (e.g., Phase Lock). |

### 2. Overlays & Layout

| Component | Composition | Purpose |
| --- | --- | --- |
| **Modal** | `Text` + `Button` + `Slot` | Managed overlay with header, footer, and backdrop-blur. Includes `Escape` key logic. |
| **TabbedPanel** | `Button` + `Text` | (In Progress) Switches between different content views. |

### 3. Information & Status

| Component | Composition | Purpose |
| --- | --- | --- |
| **ProgressTracker** | `Icon` + `Text` + `BarSegment` | Displays Kuhlthau ISP stages and percentage with contextual status messages. |
| **TopicStatusIndicator** | `Icon` + `Text` | (In Progress) Visual badge for topic readiness. |

---

## 🤖 AI Implementation Rules (For Agents)

> [!IMPORTANT]
> **Rule 1:** When building Molecules, ensure the `focus-ring` of inputs matches the `primary` color of buttons.
> **Rule 2:** Do not hardcode specific hex colors. Use the Atomic props (e.g., `variant="primary"` or `color="white"`).
> **Rule 3:** Use `aria-label` on buttons that contain only icons (like the close button in `Modal`).

### Common Composition Patterns

```vue
<div class="flex space-x-2">
  <Input size="md" :disabled="loading" />
  <Button size="md" :disabled="loading" variant="primary">Submit</Button>
</div>

```

---

## 📂 Directory Progress

```text
src/components/molecules
├── ActionBar.vue
├── AuthButton.vue
├── CloseButton.vue
├── FocusItem.vue
├── FullScreenLoader.vue
├── IndexStatItem.vue
├── KeywordListItem.vue
├── MasterListPanel.vue
├── MessageInput.vue
├── Modal.vue
├── ProgressTracker.vue
├── ReadMe.md
├── ResearchValidation.vue
├── ScopeListItem.vue
├── SidebarNodeItem.vue
├── TabbedPanel.vue
├── TopicStatusIndicator.vue
└── ViewListItem.vue
```

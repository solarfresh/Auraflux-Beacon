## Molecules: Actions

Action molecules are functional clusters designed to capture user input or trigger significant application events. They combine input atoms with trigger atoms to create unified, purposeful interaction units.

## 🧭 Design Principles

* **Intent-Driven**: Every action molecule must have a clear primary goal (e.g., "Submit", "Login", "Search").
* **State Synchronization**: Trigger buttons must reflect the state of associated inputs (e.g., staying disabled until validation passes).
* **Feedback Loops**: Action molecules should provide immediate visual feedback upon interaction (e.g., loading states or variant changes).
* **Keyboard Accessibility**: Components must support standard keyboard interactions, such as `Enter` for submission.

---

## 🛠 Component Catalog

### 1. MessageInput

A composite entry field for chat-style interactions or search queries.

* **Composition**: `Input` + `Button` + `Icon`.
* **Standardization**: Uses `size="lg"` for high-visibility interaction areas.
* **Logic**: Trims whitespace and prevents empty emissions.

### 2. ActionBar

A persistent footer container used for high-level workflow transitions.

* **Composition**: `Button[variant="primary"]` + `Text`.
* **Usage**: Typically positioned at the bottom of a panel to "Commit" or "Proceed" to the next research phase.

### 3. AuthButton

A state-aware trigger for session management.

* **Composition**: `Button` wrapper that toggles between `primary/secondary` variants.
* **Logic**: Automatically switches icons (`ArrowRightOnRectangle` vs. `UserMinus`) and labels based on the `isLoggedIn` prop.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: Matching Scales.** Always maintain consistent sizing between sibling atoms within an action group (e.g., an `lg` Input must be paired with an `lg` Button).
> **Rule 2: Propagated States.** Action molecules must propagate the `disabled` or `loading` state to all internal children to prevent accidental double-submissions.
> **Rule 3: Atomic Synergy.** Leverage the `Button` atom's internal icon handling instead of manually nesting `Icon` atoms to keep the template clean.

### Correct Composition Pattern

```vue
<div class="flex space-x-3 items-end">
  <Input size="lg" :disabled="busy" v-model="data" />
  <Button
    size="lg"
    :disabled="busy || !data"
    variant="primary"
  >
     Submit
  </Button>
</div>

```

---

## 📂 Directory Progress

```text
src/components/molecules/actions/
├── ActionBar.vue           # Workflow transition control
├── AuthButton.vue          # Session state toggle
├── MessageInput.vue        # Primary data entry
└── README.md               # You are here

```

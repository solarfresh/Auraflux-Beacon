# Molecules: Actions

Action molecules are functional clusters designed to capture user input or trigger significant application events. They combine input atoms with trigger atoms to create a complete interaction unit.

## 🧭 Design Principles

* **Call to Action (CTA)**: Every action molecule must have a clear primary goal (e.g., "Send", "Proceed", "Save").
* **State Synchronization**: Triggers (Buttons) must reflect the state of inputs (e.g., a button remains disabled until the input meets validation requirements).
* **Keyboard First**: All action molecules must support standard keyboard interactions, such as `Enter` for submission.

---

## 🛠 Component Catalog

### 1. MessageInput

A composite entry field used for chat-style interactions or search queries.

* **Composition**: `Input` + `Button` + `Icon`.
* **Standardization**: Uses `size="lg"` as the default for high-visibility interaction areas.
* **Logic**: Trims input whitespace and prevents empty emissions.

### 2. ActionBar

A persistent footer container used for high-level workflow transitions.

* **Composition**: `Button[variant="primary"]` + `Text`.
* **Context**: Often used at the bottom of a page to "Lock" data or move to the next phase of the ISP (Information Search Process).
* **Auth-Aware**: Integrated with `useWorkflowAuth` to ensure secure execution.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1:** Action molecules must propagate the `isDisabled` state to all children to prevent "partial" interactions.
> **Rule 2:** Always maintain consistent sizing between sibling atoms (e.g., an `lg` Input must be paired with an `lg` Button).
> **Rule 3:** Use the `flex-1` class on inputs to ensure they occupy the maximum available horizontal space within the action group.

### Correct Composition Pattern

```vue
<div class="flex space-x-3 items-end">
  <Input size="lg" :disabled="busy" v-model="data" />
  <Button size="lg" :disabled="busy || !data" variant="primary">
     Submit
  </Button>
</div>

```

---

## 📂 Directory Progress

```text
src/components/molecules/actions/
├── ActionBar.vue           # Workflow transition control
├── MessageInput.vue        # Data entry group
└── README.md               # You are here

```

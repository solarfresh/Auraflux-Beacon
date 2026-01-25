# Molecules: Actions

Action molecules are functional clusters designed to capture user input or trigger application events. They represent the "Verb" of our UI, focusing on capturing intent and maintaining strict state synchronization between inputs and triggers.

## 🧭 Design Principles

* **Atomic Bones**: Action molecules must never use raw HTML containers. Use `Stack` for vertical forms and `Cluster` for horizontal input groups to ensure consistent spacing.
* **Scale Integrity**: Maintain a 1:1 scale ratio between sibling atoms. An `md` Input must always be paired with an `md` Button to ensure optical alignment.
* **State Propagation**: The molecule is the "Source of Truth" for its internal atoms. If the molecule is `disabled` or `loading`, this state must be propagated to all child components.
* **Proximity Logic**: Use specific gap tokens (`gap="xs"`) to bind labels to inputs, and larger tokens (`gap="md"`) to separate independent action groups.

---

## 🛠 Component Catalog

### 1. FormField

A structural wrapper that binds labels, inputs, and validation messages.

* **Composition**: `Stack` > [`Cluster` (Label/Hint), `Slot` (Input/Textarea), `Text` (Error/Description)].
* **Responsibility**: Manages the visual relationship between a form control and its metadata.

### 2. MessageInput

A composite entry field for chat-style interactions or search queries.

* **Composition**: `Box` > `Cluster` > [`Input`, `Button` (Submit Icon)].
* **Standardization**: Uses `size="lg"` for high-visibility interaction areas.

### 3. ActionBar

A persistent container for workflow transitions, typically found in footers.

* **Composition**: `Box` > `Cluster` > [`Button` (Cancel/Secondary), `Button` (Primary/Submit)].
* **Layout Rule**: Aligns primary actions to the right (end) to follow standard UX patterns.

### 4. AuthButton

A state-aware trigger for session management.

* **Logic**: Automatically handles variant switching and icon toggling based on the user's authentication state.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Magic Spacing.** Replace all `space-x-*` or `mb-*` classes with the `gap` prop on `Stack` or `Cluster`.
> **Rule 2: Flat Attributes.** Use `inheritAttrs: false` and `v-bind="$attrs"` to ensure that layout classes injected by parents (like `flex-1`) are applied to the root Box/Stack.
> **Rule 3: Label Accessibility.** Always ensure the `FormField` provides a scoped ID to the input slot to maintain the `label[for]` and `input[id]` connection.

### Standard Industrial Pattern

```vue
<VStack gap="sm" v-bind="$attrs">
  <FormField id="search" label="Global Search">
    <template #default="{ id }">
      <VCluster gap="none">
        <VInput :id="id" size="md" class="rounded-r-none" />
        <Button size="md" variant="primary" class="rounded-l-none">
          Search
        </Button>
      </VCluster>
    </template>
  </FormField>
</VStack>

```

---

## 📂 Directory Progress

```text
src/components/molecules/actions/
├── FormField.vue           # Added: Core input wrapper
├── ActionBar.vue           # Workflow transition control
├── AuthButton.vue          # Session state toggle
├── MessageInput.vue        # Primary data entry
└── README.md               # You are here

```

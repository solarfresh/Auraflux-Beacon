# Atoms: The Periodic Table of UI

Atoms are the smallest, indivisible functional units of the **Strategic Research ISP** platform. They are purely presentational, layout-agnostic (unless categorized as Layout), and driven entirely by props.

## 📂 Directory Structure & Categorization

To optimize for AI context windows and developer ergonomics, Atoms are categorized into four specialized domains:

### 1. [Layout](layout/README.md) `atoms/layout/`

**The Skeleton & Skin.**

* Components: `Box`, `Stack`, `Cluster`, `Spacer`.
* Responsibility: Managing space, alignment, and containment. These replace all raw HTML layout tags.

### 2. [Actions](actions/README.md) `atoms/actions/`

**The Interaction Engines.**

* Components: `Button`.
* Responsibility: Handling user intent and triggering events with standardized feedback (loading, hover, focus).

### 3. [Data Display](data-display/README.md) `atoms/data-display/`

**The Voice & Vision.**

* Components: `Text`, `Icon`, `Badge`, `VProgressSegment`, `MarkdownRenderer`.
* Responsibility: Presenting information semantically and accessible. Strictly read-only.

### 4. [Forms](forms/README.md) `atoms/forms/`

**The Data Collectors.**

* Components: `Input`, `Checkbox`, `Select`, `Textarea`.
* Responsibility: Capturing user input while maintaining strict focus and validation states.

---

## 🧭 Global Atomic Principles

1. **Zero Raw HTML**:
No `<div>`, `<span>`, `<h1>`, `<button>`, or `<input>` should exist outside of these Atoms. All UI must be composed using these primitives.
2. **No External Margins**:
An Atom never dictates its own outer spacing. Spacing is the sole responsibility of the **Parent Layout Atom** (`Stack` or `Cluster`).
3. **Semantic Integrity**:
We decouple visual style from HTML tags. A `Text` component can look like an `h1` but be rendered as a `p` tag for document structure.
4. **Prop-Driven Logic**:
Atoms do not fetch data or hold global state (Pinia). They receive data via props and emit raw events.

---

## 🤖 AI System Prompt Context

> [!IMPORTANT]
> **Priority 1**: When building or refactoring components, always check the `layout/` directory first to establish the container structure.
> **Priority 2**: Use the **"Skin & Bones"** pattern: A `Box` (Skin) provides padding/background, while a `Stack` or `Cluster` (Bones) provides the internal alignment.
> **Priority 3**: Strictly follow the directory-specific READMEs for naming conventions (e.g., PascalCase for `Icon` names).

---

## 🛠 Usage Example

```vue
<template>
  <Box tag="aside" padding="md" background="white" border="right">

    <Stack gap="lg">

      <VTypography tag="h2" size="xl" weight="bold">Research Panel</VTypography

      <Button variant="primary" iconName="PlusCircle">
        Create New Topic
      </Button>

    </Stack>

  </Box>
</template>

```

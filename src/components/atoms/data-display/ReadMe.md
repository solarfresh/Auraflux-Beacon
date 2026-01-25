# Atoms: Data Display

Data Display atoms are responsible for presenting information to the user. They are strictly read-only and focus on typography, iconography, and visual status signaling.

## 🧭 Core Principles

* **Semantic Typography**: Visual size is decoupled from HTML tags. We use the `Text` atom to ensure SEO/Accessibility (`h1`) while maintaining design flexibility (`size="md"`).
* **Iconographic Consistency**: Icons must never be used alone to convey critical meaning; they should always be paired with text or have associated `aria-labels`.
* **Zero Layout Logic**: These components should not have external margins. They should be positioned by `Layout` atoms (Box, Stack, Cluster).

---

## 🛠 Component Catalog

### 1. Text

The typography engine. Replaces all `<h1>` through `<h6>`, `<p>`, and `<span>`.

* **Props**:
* `tag`: The HTML element (`h1`, `p`, `span`, etc.).
* `size`: Design tokens from `xs` to `4xl`.
* `weight`: `normal`, `medium`, `semibold`, `bold`.
* `color`: Semantic tokens (e.g., `gray-900`, `indigo-600`, `red-500`).
* `truncate`: Boolean to enforce single-line ellipsis.



### 2. Icon

A dynamic wrapper for Heroicons.

* **Props**:
* `name`: **PascalCase** string matching Heroicon exports.
* `size`: Numeric or semantic scale (e.g., `4`, `5`, `6`).


* **Usage**: Always use the `Icon` atom instead of importing SVGs directly into higher-level components.

### 3. Badge

Small status or category indicators.

* **Variants**: `indigo`, `gray`, `amber`, `emerald`, `red`.
* **Shape**: Default is `rounded-full` for a pill-like appearance.
* **Usage**: Ideal for metadata in `ListItems` or status indicators in `ResearchValidation`.

### 4. BarSegment

The building block for progress bars or status distributions.

* **Props**:
* `width`: Percentage (0-100).
* `color`: Semantic color mapping to the system's status tones.



### 5. MarkdownRenderer

A safe wrapper for rendering AI-generated research content.

* **Logic**: Uses `markdown-it` to sanitize and style raw strings into semantic HTML within the design system's constraints.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Raw Text.** Never wrap strings in `<div>`, `<span>`, or `<p>` tags. Always use the `Text` atom.
> **Rule 2: Icon Safety.** If an icon is used as a standalone action (inside a Button), ensure it has a descriptive name.
> **Rule 3: Color Intent.** Use `emerald` for "Success/Stable", `amber` for "AI-Extracted/Warning", and `red` for "Critical/Low Quality". Do not use these colors for purely aesthetic purposes.

### Correct Implementation Pattern

```vue
<Text tag="h1" size="2xl" weight="bold">Research Dashboard</Text>

<Badge variant="emerald">Verified Source</Badge>

<Icon name="DocumentText" size="5" class="text-gray-400" />

<Text size="sm" color="gray-500" truncate>
  This is a very long research topic title that needs to stay on one line.
</Text>

```

---

## 🎨 Design Tokens

| Property | Token | Value |
| --- | --- | --- |
| **Primary Text** | `gray-900` | High contrast for readability |
| **Secondary Text** | `gray-500` | Muted for metadata |
| **Success Tone** | `emerald-600` | Stable research data |
| **Warning Tone** | `amber-500` | AI-generated/Unverified |
| **Danger Tone** | `red-600` | Error or Low Grounding |

---

## 📂 Directory Structure

```text
src/components/atoms/data-display/
├── Badge.vue
├── BarSegment.vue
├── Icon.vue
├── MarkdownRenderer.vue
├── Text.vue
└── README.md          # You are here

```

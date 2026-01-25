# Atoms: Indicators

Indicators are specialized atoms used to display information, communicate status, and provide visual feedback. Following the **Bootstrap** classification, this category groups all components that represent the state of the application or its data.

## 🧭 Core Principles

* **Semantic Signaling**: Colors are never purely aesthetic. They must follow the system's semantic mapping (e.g., `danger` for errors, `success` for verified data).
* **Typography Control**: All textual content must be rendered through the `VTypography` atom to ensure consistent scaling and accessibility.
* **Non-Interactive by Default**: Indicators are read-only. If a component requires a click action, it likely belongs in the `Buttons` category or should be wrapped in a `VButton`.
* **Material Elevation & Depth**: Visual indicators use Material Design's elevation levels (z-index and shadows) to signify information hierarchy.

---

## 🛠 Component Catalog

### 1. VTypography

The central typography engine. It decouples the visual style from the HTML semantic structure.

* **Props**:
* `tag`: `h1` | `h2` | `h3` | `p` | `span` | `label` (SEO/Accessibility).
* `size`: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.
* `variant`: `display`, `body`, `caption`.


* **Tailwind Reference**: Uses `text-{size}`, `font-{weight}`, and `leading-{tight|relaxed}`.

### 2. VIcon

A wrapper for SVG-based iconography (e.g., Heroicons).

* **Props**:
* `name`: PascalCase name of the icon.
* `size`: Numeric scale (e.g., `4` for 16px, `5` for 20px).


* **Logic**: Inherits color via `text-current` to allow parent-level styling.

### 3. VBadge

Small status descriptors based on the **Bootstrap Badge** model.

* **Variants**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`.
* **Style**: Supports `pill` (rounded-full) and `outline` modes.

### 4. VProgressSegment

The atomic unit of a progress bar.

* **Usage**: Used to build multi-segment bars or simple loading indicators.
* **Material Touch**: Uses smooth CSS transitions for width changes to mimic Material motion.

### 5. VMarkdown

A safe renderer for structured text content, specifically for AI-generated outputs.

* **Constraint**: Restricts styles to the system's typography tokens to prevent layout shifts.

---

## 🤖 AI Implementation Rules

> [!IMPORTANT]
> **Rule 1: No Naked Strings.** Never use raw `<span>` or `<div>` for text. Use `<VTypography>`.
> **Rule 2: Semantic Consistency.** Always map status to the correct variant:
> * **Emerald (Success)**: Verified/Grounded data.
> * **Amber (Warning)**: AI-generated/Unverified content.
> * **Red (Danger)**: Errors or Low-confidence results.
> **Rule 3: Icon-Text Pairing.** Icons in indicators should usually be accompanied by text unless the context provides high affordance.
>
>

### Correct Implementation Pattern

```vue
<div class="flex items-center gap-3">
  <VTypography tag="h2" size="xl" weight="bold">
    Research Analysis
  </VTypography>
  <VBadge variant="success">Verified</VBadge>
</div>

<div class="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden">
  <VProgressSegment :width="85" color="emerald" />
</div>

<div class="flex items-center gap-1 text-slate-500">
  <VIcon name="Clock" size="4" />
  <VTypography size="sm">2 mins ago</VTypography>
</div>

```

---

## 🎨 Design Tokens (Tailwind Mapping)

| Intent | Bootstrap Variant | Tailwind Class | Material State |
| --- | --- | --- | --- |
| **High Emphasis** | `primary` | `text-slate-900` | On-Surface |
| **Medium Emphasis** | `secondary` | `text-slate-500` | On-Surface Variant |
| **Positive** | `success` | `bg-emerald-100 text-emerald-700` | Grounded / Success |
| **Attention** | `warning` | `bg-amber-100 text-amber-700` | AI-Generated / Caution |
| **Critical** | `danger` | `bg-red-100 text-red-700` | Error / Low Confidence |

---

## 📂 Directory Structure

```text
src/components/atoms/indicators/
├── VBadge.vue             # Status pills
├── VIcon.vue              # System icons
├── VMarkdown.vue          # Content renderer
├── VProgressSegment.vue   # Progress building blocks
├── VTypography.vue        # Text engine
└── README.md              # Documentation

```

# Atoms Layer

Atoms are the basic building blocks of our design system. In the context of **Vue 3** and **Tailwind CSS**, an atom is a single-purpose component that cannot be broken down further without losing its meaning.

## 🏗 The Architecture

Following the **Bootstrap** categorization model, we group our atoms into four functional families to prevent directory clutter and ensure developer intuition.

### 1. 🔘 [Buttons](buttons/README.md) (Actions)

Components that trigger events or navigate.

* **Core:** `VButton`
* **Focus:** Interaction states, ripple effects, and loading indicators.

### 2. 📝 [Forms](forms/README.md) (Inputs)

Components that capture user data.

* **Core:** `VInput`, `VCheckbox`, `VSelect`, `VTextarea`, `VRadio`
* **Focus:** Focus rings, validation states, and `v-model` synchronization.

### 3. 📢 [Indicators](indicators/README.md) (Display)

Components that present status or static information.

* **Core:** `VTypography`, `VBadge`, `VIcon`, `VProgressSegment`
* **Focus:** Semantic coloring, readability, and information hierarchy.

### 4. 📐 [Layout](layout/README.md) (Infrastructure)

The structural "bones" and "skin" that hold other atoms.

* **Core:** `VBox`, `VStack`, `VCluster`, `VSpacer`
* **Focus:** Spacing tokens (8px grid), alignment, and containment.

### 5. 🕸 [Canvases](canvases/README.md) (Graph Infrastructure)

Low-level components for node-link diagrams and spatial data.

* **Core:** `VNodeHandle`
* **Focus:** Coordinate anchoring, connection port logic, and graph-specific semantic markers.

---

## 🧭 Global Atom Principles

### 1. No External Margins

Atoms are "good neighbors." They never define their own external spacing.

* **Wrong:** `<VButton class="mt-4" />`
* **Right:** Wrap the button in a `<VStack gap="md">` or `<VBox padding="md">`.

### 2. Prefix Authority

Every atom is prefixed with `V` (e.g., `VInput`). This prevents collisions with native HTML elements and clarifies that the component is part of our internal design system.

### 3. Prop-Driven Tailwind

Avoid passing raw Tailwind classes for core features like colors or rounding. Use props to ensure we stay within our Design Tokens.

* **Use:** `<VBox rounded="xl" />`
* **Avoid:** `<VBox class="rounded-[20px]" />`

### 4. Material Elevation

We utilize a standardized elevation system for depth.

* **Level 0:** Flat (Surface)
* **Level 1:** `shadow-sm` (Card resting)
* **Level 2:** `shadow-md` (Hover/Active)
* **Level 3:** `shadow-lg` (Dropdowns/Modals)

---

## 🎨 Token Reference Summary

| Category | Token Scale | Tailwind Implementation |
| --- | --- | --- |
| **Spacing** | 4px / 8px | `p-{n}`, `gap-{n}`, `m-{n}` |
| **Typography** | Semantic | `text-sm` (Caption) to `text-4xl` (Display) |
| **Rounding** | Standardized | `rounded-md` (Default), `rounded-xl` (Container) |
| **Colors** | Bootstrap Semantic | `primary`, `success`, `danger`, `warning`, `info` |
| **Graph** | Reliability | `border-solid` (Verified), `border-dashed` (Suggested) |

---

## 📂 Directory Structure

```text
src/components/atoms/
├── buttons/        # Action triggers (VButton)
├── canvases/       # Graph units (VNodeHandle)
├── forms/          # User inputs (VInput, VCheckbox)
├── indicators/     # Data display (VTypography, VBadge, VIcon)
├── layout/         # Structure (VBox, VStack, VCluster)
└── README.md       # You are here
```

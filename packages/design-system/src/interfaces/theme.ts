/**
 * Industry-standard naming for action component hierarchy within a composite layout.
 * Defines the relative importance and visual rank among interactive elements.
 */
export type AttentionToken =
  | 'primary'   // Highest hierarchy: single main call-to-action per section
  | 'secondary' // Secondary hierarchy: supporting or neutral actions
  | 'tertiary'; // Lowest hierarchy: text links or ghost-style actions

export interface AttentionPreset {
  /** The inferred default semantic intent */
  intent: IntentToken;
  /** The inferred default physical surface model */
  surface: SurfaceToken;
}

/**
 * Industry-standard naming for semantic intent and business purpose.
 * Represents the color family and emotional tone of the component.
 */
export type IntentToken =
  | 'neutral'   // Low emphasis, default state with no specific semantic tone
  | 'brand'     // Primary brand identity and key highlighted features
  | 'success'   // Positive outcomes, active status, or completed operations
  | 'warning'   // Non-blocking cautions or pending actions requiring attention
  | 'danger'    // Critical warnings, errors, or destructive operations
  | 'info';     // General dynamic updates, system notices, or informational messages

/**
 * Represents the comprehensive style contract for a component surface across all rendering states.
 * Encapsulates static physical properties alongside dynamic interactive states.
 */
export interface SurfaceStyle {
  /** Static background color utility class */
  bg: string;

  /** Static foreground text color utility class */
  text: string;

  /** Static border color and structure utility class */
  border: string;

  /** Interactive hover state utility class */
  hover: string;

  /** Interactive focus-visible state utility class (e.g., focus ring) */
  focus: string;
}

/**
 * Encapsulates the complete set of surface styles for all SurfaceToken variations.
 */
export type SurfaceStyleMap = Record<SurfaceToken, SurfaceStyle>;

/**
 * Industry-standard naming for surface styling and visual container form.
 * Controls the overall background fill, border presence, and contrast mode.
 */
export type SurfaceToken =
  | 'base'      // Default surface: standard background with neutral contrast
  | 'solid'     // High emphasis: fully filled background with strong contrast
  | 'soft'      // Medium emphasis: subtle background tint with semantic text
  | 'outline'   // Low emphasis: border-only frame with transparent background
  | 'ghost';    // Minimal emphasis: borderless and transparent until hovered


export type Alignment = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type BorderToken = 'all' | 'top' | 'bottom' | 'left' | 'right' | 'dashed' | 'none';
export type ComponentSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ContainerSizeToken = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type FontWeightToken = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type Justification = 'start' | 'center' | 'end' | 'between' | 'around';
export type GapSizeToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TagToken = 'p' | 'span' | 'strong' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'fieldset' | 'footer' | 'header' | 'label' | 'li';

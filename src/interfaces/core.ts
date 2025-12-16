/**
 * Global Atomic Types
 * Used to ensure consistency across all modules and stores.
 */

/** Unique identifier for any entity in the system. */
export type ID = string;

/** ISO 8601 formatted string (e.g., "2025-12-16T08:00:00Z"). */
export type DateTimeString = string;

/** Hex or CSS color string for UI rendering. */
export type ColorString = string;

/** Percentage representation from 0 to 100. */
export type Percentage = number;

/**
 * Spatial & Geometry Definitions
 * Common types for canvas-based interactions and UI positioning.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface RectSize {
  width: number;
  height: number;
}

export interface BoundingBox extends Point2D, RectSize {}

/**
 * Universal Workflow Constants
 */

/** Feasibility assessment for research topics (U.S. 1). */
export type FeasibilityStatus = 'HIGH' | 'MEDIUM' | 'LOW';

/** Standardized roles for communication and logging. */
export type ParticipantRole = 'user' | 'system' | 'ai-agent';

/**
 * Base Communication Structure
 * A generic interface that specific chat implementations will extend.
 */

export interface BaseChatMessage {
  id: ID;
  role: ParticipantRole;
  content: string;
  timestamp: DateTimeString;
  sequenceNumber: number;
}

/**
 * Design System Tokens
 * Used for consistent styling across different node types and UI components.
 */

export interface VisualToken {
  backgroundColor: ColorString;
  borderColor: ColorString;
  textColor: ColorString;
  icon?: string;
}

/**
 * Utility Type: Result Wrapper
 * Used for handling API responses or internal service outcomes.
 */

export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
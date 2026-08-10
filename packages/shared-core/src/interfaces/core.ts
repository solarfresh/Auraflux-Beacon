/**
 * Global Types
 * Used to ensure consistency across all modules and stores.
 */

/** Unique identifier for any entity in the system. */
export type ID = string;

/** ISO 8601 formatted string (e.g., "2025-12-16T08:00:00Z"). */
export type DateTimeString = string;

export type EntityStatus =
  | 'USER_DRAFT'    // Under active editing by the user
  | 'AI_EXTRACTED'  // Proposed by the AI Agent, awaiting user review
  | 'LOCKED'        // Finalized and protected from accidental changes
  | 'ON_HOLD'       // Temporarily sidelined from the active map or focus
  | 'ARCHIVED';     // Removed from view but preserved in history

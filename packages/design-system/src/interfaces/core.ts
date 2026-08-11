/**
 * Global Types
 * Used to ensure consistency across all modules and stores.
 */

/** Unique identifier for any entity in the system. */
export type ID = string;

/** ISO 8601 formatted string (e.g., "2025-12-16T08:00:00Z"). */
export type DateTimeString = string;

export type EntityAttribute =
  | 'Name'      // The name of the entity, used for display and identification.
  | 'CREATED'   // The timestamp when the entity was created.
  | 'EDITED'    // The timestamp when the entity was last edited.

export type EntityStatus =
  | 'DRAFT'     // Under active editing by the user
  | 'REVIEW'    // Proposed by the AI Agent, awaiting user review
  | 'LOCKED'    // Finalized and protected from accidental changes
  | 'ON_HOLD'   // Temporarily sidelined from the active map or focus
  | 'ARCHIVED'  // Removed from view but preserved in history
  | 'PENDING'   // Awaiting approval or further action
  | 'APPROVED'  // Approved and ready for use
  | 'REJECTED'  // Not approved and requires changes
  | 'PUBLISHED' // Made publicly available
  | 'ACTIVE'    // Currently in use or operational
  | 'INACTIVE'  // Not currently in use but can be reactivated
  | 'ARCHIVED'  // Removed from active use but kept for historical reference
  | 'DELETED';  // Marked for deletion and no longer accessible

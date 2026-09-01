import { TripleItem } from "@/interfaces/repository";
import { ID } from "@auraflux/design-system/interfaces/core";

/**
 * Target vector index layer in ChunkData for OpenSearch Multi-Vector search.
 */
export type TargetVectorField = 'question' | 'concept' | 'evidence';

/**
 * Unified query structure for OpenSearch Hybrid Search (kNN + BM25)
 * and downstream context reranking across all diagnostic gates.
 */
export interface ContextQuery {
  /**
   * Natural language query sentence with full context, optimized for Dense Vector (kNN) embeddings.
   */
  searchStatement: string;

  /**
   * Specifies which vector index in ChunkData.vectors to target.
   * - Gate 1 (Assumptions): targets 'question' or 'concept'
   * - Gate 2 (Vagueness): targets 'evidence'
   * - Gate 3 (Discrepancies): targets 'concept' or 'evidence'
   */
  targetVectorField: TargetVectorField;

  /**
   * Explicit keywords extracted for exact BM25 matching in Hybrid Search.
   */
  keywords: string[];

  /**
   * Optional semantic triples (Subject-Predicate-Object) for precise Triple-matching.
   */
  structuredKeywords?: TripleItem[];

  /**
   * Explicit semantic objective used by Reranker or Context Engine to validate search results.
   */
  queryIntent: string;
}

/**
 * Pointer back to the exact source ChunkData and Evidence location.
 */
export interface ChunkPointer {
  /** Target Chunk ID */
  chunkId: string;

  /** Parent File ID */
  fileId: string;

  /** Location within document (e.g., "Page 5, Section 3.2") */
  location: string;
}

/**
 * Standardized verification result returned after executing the ContextQuery against database/facts.
 * Populated consistently across ALL diagnostic gates after retrieval.
 */
export interface VerificationResult {
  /**
   * Whether the DB lookup successfully found relevant context facts.
   */
  isVerified: boolean;

  /**
   * The exact reference fact or context statement retrieved from the database.
   * Null if database lookup yields no match (unverifiable).
   */
  referenceFact: string | null;

  /**
   * Traceable reference back to the original ChunkData source.
   */
  sourceChunk?: ChunkPointer | null;
}

/**
 * Standard base contract for all diagnostic items.
 * Ensures strict multi-gate structural consistency across Gate 1, Gate 2, and Gate 3.
 */
export interface BaseDiagnostic {
  /**
   * Unique identifier for the diagnostic item (e.g., "DIAG-01").
   */
  id: ID;

  /**
   * The specific target phrase, term, or implicit premise being diagnosed.
   */
  target: string;

  /**
   * Human-readable diagnostic rationale or semantic explanation.
   */
  description: string;

  /**
   * Unified query specification for database verification. Null if not applicable.
   */
  query: ContextQuery | null;

  /**
   * Verification outcome populated post-retrieval. Null before execution or if no query was generated.
   */
  verification?: VerificationResult | null;
}

/* ===================================================================
 * Diagnostics Sub-structures
 * =================================================================== */

/* ===================================================================
 * Gate 1: Implicit Assumption Diagnostic
 * =================================================================== */

export type AssumptionDimension =
  | 'capability'
  | 'resources'
  | 'causality'
  | 'environment';

/**
 * Gate 1 Diagnostic: Verifies an unstated implicit premise against context facts.
 */
export interface AssumptionDiagnostic extends BaseDiagnostic {
  /**
   * Core dimension of the implicit assumption.
   */
  dimension: AssumptionDimension;

  /**
   * Concrete benchmark or condition required to validate whether the assumption holds true.
   */
  matchCriterion: string | null;
}

/* ===================================================================
 * Gate 2: Vagueness Quantification Diagnostic
 * =================================================================== */

/**
 * Gate 2 Diagnostic: Identifies vague terms and defines expected variables to extract from facts.
 */
export interface VaguenessDiagnostic extends BaseDiagnostic {
  /**
   * Target variable keys expected to be extracted from the retrieved referenceFact.
   */
  expectedVariables: string[];
}

/* ===================================================================
 * Gate 3: Assertion Discrepancy Diagnostic
 * =================================================================== */

export type DiscrepancyType =
  | 'contradiction'   // Logical impossibility or strict direct clash with verified facts
  | 'inconsistency'   // Parameter, metric, or boundary discrepancy with verified facts
  | 'unverifiable';   // Missing facts in database to confirm or deny the assertion

/**
 * Gate 3 Diagnostic: Checks if explicit proposition assertions clash with verified context facts.
 */
export interface DiscrepancyDiagnostic extends BaseDiagnostic {
  /**
   * Broad classification of the logical discrepancy against retrieved facts.
   */
  discrepancyType: DiscrepancyType;
}

/**
 * Consolidated diagnostic results for a proposition across all standard diagnostic gates.
 */
export interface PropositionDiagnostics {
  /**
   * Gate 1: Uncovered implicit assumptions. Empty array if all premises are verified/explicit.
   */
  assumptions: AssumptionDiagnostic[];

  /**
   * Gate 2: Vague or unquantified terms requiring parameter resolution. Empty array if none found.
   */
  vagueTerms: VaguenessDiagnostic[];

  /**
   * Gate 3: Assertion discrepancies or contradictions against facts. Empty array if fully aligned.
   */
  discrepancies: DiscrepancyDiagnostic[];
}

/**
 * Categorizes extracted propositions based on their linguistic and structural properties.
 *
 * NOTE: The Extractor Agent strictly identifies structural properties (`ClaimType`).
 * Diagnostic verdicts (e.g., whether a `mental_model` is actually an "unverified_assumption"
 * or a "cognitive_gap") are determined by downstream Verifier Agents after cross-checking
 * against knowledge bases or DB records.
 */
export type ClaimType =
  // =========================================================================
  // Testable Structural Types (requiresVerification: true)
  // =========================================================================

  /**
   * Subjective cognitive claims describing internal expectations, perceptions,
   * unspoken beliefs, or assumed intentions of an entity (e.g., "A believes B is handling task X").
   * Downstream verifiers will cross-check system records to detect potential unverified assumptions or alignment gaps.
   */
  | 'mental_model'

  /**
   * Explicit, testable assertions regarding specific recorded events, official approval statuses,
   * system metrics, documented deliverables, or explicit task assignments that can be empirically verified.
   */
  | 'objective_claim'

  // =========================================================================
  // Non-Testable / Structural Context Types (requiresVerification: false)
  // =========================================================================

  /**
   * Descriptive metadata regarding physical environment, time, location, seating, duration,
   * or atmosphere. Separated cleanly from core diagnostic reasoning.
   */
  | 'background_context'

  /**
   * Retrospective observations of high-level outcomes, cumulative historical results,
   * or macro status symptoms that do not require granular database verification.
   */
  | 'macro_phenomenon'

  /**
   * Abstract principles, domain wisdom, golden rules, or general human behavioral patterns.
   */
  | 'abstract_principle'

  /**
   * Recommended methodologies, action plans, proposed solutions, or inquiry strategies.
   */
  | 'action_recommendation';

export interface PropositionItem {
  /**
   * Unique identifier for the proposition (e.g., "PROP-01").
   */
  id: ID;

  /**
   * The normalized, stand-alone statement derived from the original text.
   */
  content: string;

  /**
   * The exact verbatim segment or phrase from the source input text.
   */
  originalPhrase: string;

  /**
   * Structural classification of the proposition.
   */
  type: ClaimType;

  /**
   * Indicates whether this proposition requires downstream database search and verification.
   */
  requiresVerification: boolean;

  /**
   * Justification for why verification is or is not required.
   */
  flagReason?: string;

  /**
   * Standardized diagnostic evaluation results across all gates.
   */
  diagnostics?: PropositionDiagnostics;
}

/**
 * Represents the root diagnostic output payload from the Proposition Extraction Agent.
 * Adheres to standard LLM Structured Output and JSON Envelope conventions.
 */
export interface PropositionExtractionPayload {
  /**
   * The overarching diagnostic query or core inquiry driving this extraction session.
   * e.g., "Diagnose the cross-departmental alignment failure causing the project delay."
   */
  primaryObjective: string;

  /**
   * The primary macro symptom or observed outcome tied to the primary objective.
   * e.g., "New feature deployment was abruptly canceled."
   */
  targetPhenomenon: string;

  /**
   * The structured array of extracted propositions relevant to the primary objective.
   */
  propositions: PropositionItem[];
}

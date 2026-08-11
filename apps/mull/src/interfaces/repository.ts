import { DateTimeString, ID } from "@auraflux/design-system/interfaces/core";

/**
 * Impact level classification for strategy scope.
 */
export type ImpactLevel = 'strategic' | 'tactical' | 'operational';

/**
 * Supported document file formats.
 */
export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'csv';

/**
 * Scope and boundary boundaries for strategy alignment.
 */
export interface ChunkScope {
  /** Target business/technical domain (e.g., "IT Architecture & Compliance") */
  domain: string;

  /** Level of impact on decision-making */
  impactLevel: ImpactLevel;

  /** Non-negotiable rules or hard constraints (e.g., ["No public cloud routing"]) */
  boundaries: string[];
}

/**
 * 1. Alignment & Scope Layer
 * Contextual questions and non-negotiable boundaries for driving discussions.
 */
export interface ChunkAlignment {
  /** Core decision dilemma or question triggered by this chunk */
  targetQuestion: string;

  /** Boundary parameters and impact domain */
  scope: ChunkScope;
}

/**
 * 2. Abstraction Layer
 * High-level concepts and structural propositions (does NOT duplicate text details).
 */
export interface ChunkConcept {
  /** High-level proposition or rule title (e.g., "Data Sovereignty vs. Architectural Agility") */
  title: string;

  /** Contextual description explaining real-world impact and constraint mechanisms */
  description: string;
}

/**
 * Expresses a bound semantic triple: Entity -> Relation (Predicate/Operator) -> Metric/Constraint.
 * Provides a closed-world statement ensuring entities, logical conditions, and quantities remain coupled.
 */
export interface TripleItem {
  subject: string;
  predicate: string;
  object: string;
}

/**
 * Layer 3: Token & Entity-Relation Layer
 * Captures bound entity-metric pairs and general domain tags to prevent association mismatch.
 */
export interface ChunkKeywords {
  /**
   * List of bound semantic triples ensuring entities and their specific quantitative limits
   * remain strictly associated.
   */
  triples: TripleItem[];

  /** General high-level domain or thematic tags (e.g., ["finance", "compliance"]) */
  tags: string[];
}

/**
 * 4. Fact & Evidence Layer
 * Raw text snippets and location pointers for grounding and auditability.
 */
export interface ChunkEvidence {
  /** Exact verbatim excerpt from the document (100–300 words) */
  excerptText: string;

  /** Location pointer within the source document (e.g., "Page 5, Section 3.2") */
  location: string;
}

/**
 * Multi-Vector Embedding Layer
 * Individual vector representations corresponding to OpenSearch dense vector fields.
 */
export interface ChunkVectors {
  /** Embedding vector for `alignment.targetQuestion` */
  questionVector?: number[];

  /** Embedding vector for `concept.title` & `concept.description` */
  conceptVector?: number[];

  /** Embedding vector for `evidence.excerptText` */
  evidenceVector?: number[];
}

/**
 * Unified Repository Chunk Entity
 */
export interface ChunkData {
  /** Unique identifier for the chunk */
  id: ID;

  /** Unique identifier of the parent document */
  fileId: ID;

  /** Layer 1: Alignment & Scope */
  alignment: ChunkAlignment;

  /** Layer 2: Abstract Concept */
  concept: ChunkConcept;

  /** Layer 3: Keyword Tokens */
  keywords: ChunkKeywords;

  /** Layer 4: Raw Fact & Evidence */
  evidence: ChunkEvidence;

  /** Multi-Vector Embeddings (Optional on frontend) */
  vectors?: ChunkVectors;
}

/**
 * Repository Document Entity
 */
export interface RepositoryFile {
  /** Unique document identifier */
  fileId: ID;

  /** Original file name (e.g., "Q3_Procurement_Plan.pdf") */
  fileName: string;

  /** Human-readable file size (e.g., "2.4 MB") */
  fileSize: string;

  /** File format extension */
  fileType: SupportedFileType | string;

  /** ISO 8601 UTC timestamp of upload */
  uploadTime: DateTimeString;

  /** List of extracted chunks from this document */
  chunks: ChunkData[];
}

export interface FileItem {
  id: ID;
  name: string;
  type?: 'pdf' | 'doc' | 'code' | 'default';
  chunkCount: number;
  size: string;
  status?: 'ready' | 'processing' | 'error';
}

/**
 * Aggregate Page Repository View Data
 */
export interface Repository {
  /** Total count of uploaded files */
  totalFiles: number;

  /** Total count of processed chunks */
  totalChunks: number;

  /** Collection of repository documents */
  files: RepositoryFile[];
}
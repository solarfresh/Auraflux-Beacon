import type { DateTimeString, EntityStatus, ID, OperationalStatus } from '@auraflux/design-system/interfaces/core';
import type { SelectOption } from '@auraflux/design-system/interfaces/indicators';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';

export type ProviderType = 'ALL' | 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'MISTRAL' | 'CUSTOM';

export interface DynamicVariable {
  name: string;
  type?: string;
  multiline?: boolean;
  defaultValue?: string;
}

export interface LLMParameters {
  provider: ID;
  model: string;            // e.g., "gemini-3-flash-preview"
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stopSequences?: string[];
  [key: string]: unknown;
}

export interface ModelFamilies {
  id: ID;
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
}

export interface ModelProvider {
  id: ID;
  name: string;                // User-defined label (e.g., "Production Gemini")
  type: ProviderType;          // Technical category
  status: OperationalStatus;      // Real-time health state

  // Security & Identity
  apiKeyFingerprint: string;   // Masked key (e.g., "••••4n2z")
  baseUrl?: string;            // Custom endpoint for Local/Private LLMs

  // Performance Metadata
  latencyMs: number | null;    // Last recorded response time
  lastVerifiedAt: string;      // ISO Date string

  // Resource Linking
  supportedFamilies: ModelFamilies[]; // e.g., ["GEMINI", "GPT-4"]

  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export type ModelProviderForm = Partial<ModelProvider> & {
  apiKey?: string;
};

export interface TemplateVariable {
  name: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface SchemaFieldItem {
  id?: string;
  name: string;
  type: string;
  badgeText?: string;
  badgeIntent?: IntentToken;
}

export interface PromptSchemaFormData {
  purpose?: string;
  systemPrompt: string;
  promptTemplate: string;
  schemaFields: SchemaFieldItem[];
}

export interface SchemaProperty {
  type: string;
  description?: string;
}

export interface EmbeddingRrfConfigFormData {
  providerId: string;
  modelFamilyId: string;
  dimensions: number;
  candidateTopN: number;
  kFactor: number;
  vectorWeight: number;
  bm25Weight: number;
  topK: number;
  scoreCutoff: string;
}

/**
 * Standardized JSON Schema structure for Agent Output Constraints
 */
export interface AgentOutputSchema {
  type: 'object';
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

export interface Agent {
  id: ID;
  projectId?: ID;
  name: string;
  purpose?: string;
  status: EntityStatus;

  providerId: ID;
  modelFamilyId: ID;
  llmParameters?: LLMParameters;

  systemPrompt?: string;
  promptTemplate?: string;
  templateVariables?: TemplateVariable[];

  /**
   * Structured JSON Schema object for output constraints,
   * or raw string JSON for advanced customization.
   */
  outputSchema?: AgentOutputSchema;
}

/**
 * Runtime execution parameters for the embedding model
 */
export interface EmbeddingParameters {
  dimensions?: number;
  chunkSize?: number;
  chunkOverlap?: number;
  [key: string]: unknown;
}

/**
 * Defines the embedding model configuration bound to a specific project
 */
export interface Embedding {
  id: ID;
  name: string;
  role: string;
  status: EntityStatus;
  providerId: ID;
  modelFamilyId: ID;
  parameters?: EmbeddingParameters;
  projectId: ID;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}

/**
 * Form payload representation for creating or updating Embedding Configurations
 */
export type EmbeddingFormData = Omit<Embedding, 'id' | 'createdAt' | 'updatedAt'>;

export interface ProviderOption extends SelectOption {}
export interface ModelOption extends SelectOption {
  providerId: ID;
  name: string;
}
export interface EmbeddingModelOption extends SelectOption {
  providerId: ID;
  dimensions: number;
}

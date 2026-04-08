import type { DateTimeString, ConnectStatus, ID } from './core';

export type ProviderType = 'ALL' | 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'MISTRAL' | 'LOCAL' | 'CUSTOM';


/** * Represents the LLM configuration used by the Agent.
 * Maps to the "llm_parameters" column in CSV.
 */
export interface LLMParameters {
  model: string;            // e.g., "gemini-3-flash-preview"
  temperature?: number;     // Observed in typical Agent configs
  maxTokens?: number;
  topP?: number;
}

export interface ModelProvider {
  id: string;
  name: string;                // User-defined label (e.g., "Production Gemini")
  type: ProviderType;          // Technical category
  status: ConnectStatus;      // Real-time health state

  // Security & Identity
  apiKeyFingerprint: string;   // Masked key (e.g., "••••4n2z")
  baseUrl?: string;            // Custom endpoint for Local/Private LLMs
  // organizationId?: string;     // Specific to OpenAI/Azure

  // Performance Metadata
  latencyMs: number | null;    // Last recorded response time
  lastVerifiedAt: string;      // ISO Date string

  // Resource Linking
  supportedFamilies: string[]; // e.g., ["GEMINI", "GPT-4"]
  activeAgentCount: number;    // Number of agents currently using this provider

  createdAt: string;
  updatedAt: string;
}

/**
 * The core Agent entity based on the provided configuration example.
 * Maps to the CSV columns: id, name, system_prompt, etc.
 */
export interface Agent {
  id: ID;
  name: string;

  /** * The core behavioral instruction (CSV: system_prompt).
   * Used in VAgentCard for the description preview.
   */
  systemPrompt: string;

  /** * Optional template for structured dialogue (CSV: prompt_template).
   */
  promptTemplate?: string;

  /** * Default variables for the template (CSV: template_variables).
   */
  templateVariables: Record<string, any>;

  /** * JSON Schema string defining the expected tool/response output (CSV: output_schema).
   */
  outputSchema: Record<string, any>;

  /** * Model-specific tuning (CSV: llm_parameters).
   */
  llmParameters: LLMParameters;

  // --- UI & Lifecycle Extensions (for VAgentCard) ---

  /** * Functional role for filtering (e.g., 'Explorer', 'Refinement').
   */
  role: string;

  /** * Current deployment state.
   */
  // status: EntityStatus;

  // version: string;
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}
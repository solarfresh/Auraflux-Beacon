import type { DateTimeString, EntityStatus, ID } from './core';

/** * Represents the LLM configuration used by the Agent.
 * Maps to the "llm_parameters" column in CSV.
 */
export interface LLMParameters {
  model: string;            // e.g., "gemini-3-flash-preview"
  temperature?: number;     // Observed in typical Agent configs
  maxTokens?: number;
  topP?: number;
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
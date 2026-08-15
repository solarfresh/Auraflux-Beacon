import type { EntityStatus, ID, OperationalStatus } from '@auraflux/design-system/interfaces/core';
import type { SelectOption } from '@auraflux/design-system/interfaces/indicators';

export type ProviderType = 'ALL' | 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'MISTRAL' | 'LOCAL' | 'CUSTOM';

export interface LLMParameters {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stopSequences?: string[];
  [key: string]: unknown;
}

interface ModelFamilies {
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
  // organizationId?: string;     // Specific to OpenAI/Azure

  // Performance Metadata
  latencyMs: number | null;    // Last recorded response time
  lastVerifiedAt: string;      // ISO Date string

  // Resource Linking
  supportedFamilies: ModelFamilies[]; // e.g., ["GEMINI", "GPT-4"]
  activeAgentCount: number;    // Number of agents currently using this provider

  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface Agent {
  id: ID;
  name: string;
  purpose?: string;
  status: EntityStatus;

  providerId: ID;
  modelFamilyId: ID;
  llmParameters?: LLMParameters;

  systemPrompt?: string;
  promptTemplate?: string;
  templateVariables?: TemplateVariable[];

  outputSchema?: Record<string, unknown> | string;
}

export interface ProviderOption extends SelectOption {}
export interface ModelOption extends SelectOption {
  providerId: ID;
}

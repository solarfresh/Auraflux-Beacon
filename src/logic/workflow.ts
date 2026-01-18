import type { StabilityMetric } from "@/interfaces/workflow";

/**
 * getStabilityContext
 * 1-10 Scale Logic Mapping
 */
export const getStabilityContext = (score: number): StabilityMetric => {
  if (score >= 8) {
    return {
      label: 'Finalizing',
      solidity: 'SOLID',
      jitterLevel: 'NONE',
      description: 'The logic is grounded and ready for synthesis.'
    };
  } else if (score >= 4) {
    return {
      label: 'Refining',
      solidity: 'PULSING',
      jitterLevel: 'LOW',
      description: 'The focus is narrowing but needs more evidence support.'
    };
  }
  return {
    label: 'Defining',
    solidity: 'PULSING',
    jitterLevel: 'HIGH',
    description: 'The concept is still fluid and prone to hallucination.'
  };
};
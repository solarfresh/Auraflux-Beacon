import type { GroundednessMetric } from "@/interfaces/workflow";

/**
 * getStabilityContext
 * 1-10 Scale Logic Mapping
 */
export const getStabilityContext = (score: number): string => {
  if (score >= 8) {
    return 'Finalizing';
  } else if (score >= 4) {
    return 'Refining';
  }
  return 'Defining';
};

export const getNodeGroundednessContext = (groundedness: number): GroundednessMetric => {
  if (groundedness >= 8) {
    return {
      solidity: 'SOLID',
      jitterLevel: 'NONE',
      description: 'The logic is grounded and ready for synthesis.'
    };
  } else if (groundedness >= 4) {
    return {
      solidity: 'PULSING',
      jitterLevel: 'LOW',
      description: 'The focus is narrowing but needs more evidence support.'
    };
  }
  return {
    solidity: 'PULSING',
    jitterLevel: 'HIGH',
    description: 'The concept is still fluid and prone to hallucination.'
  };
};
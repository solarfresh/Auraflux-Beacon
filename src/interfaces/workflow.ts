export type ISPStep =
  | 'TOPIC_DEFINITION_LOCKIN' // Merges INITIATION and SELECTION phases. Focus: Moving from vague concepts to a locked research question (Score < 8 to Score >= 8).
  | 'EXPLORATION'           // Focus: Dealing with information overload (Confusion/Frustration) by sifting and evaluating sources.
  | 'FORMULATION'           // Focus: Structuring arguments and concepts (Clarity/Focus) into a coherent framework.
  | 'COLLECTION'            // Focus: Purposefully gathering specific evidence to support the finalized argument structure (Confidence).
  | 'PRESENTATION';         // Focus: Finalizing, reviewing, and exporting the research output (Satisfaction/Relief).
export type TopicKeywordStatus = 'LOCKED' | 'DRAFT' | 'DISCARDED';

export const ISP_STEP_TEXT_MAP: Record<ISPStep, { name: string; description: string; percentage: number; }> = {
    TOPIC_DEFINITION_LOCKIN: {
        name: 'Topic Definition & Lock-in',
        description: 'Defining the research question and locking scope',
        percentage: 10,
    },
    EXPLORATION: {
        name: 'Knowledge Retrieval',
        description: 'Sifting large amounts of information and managing conflicts',
        percentage: 30,
    },
    FORMULATION: {
        name: 'Argument Structuring',
        description: 'Building the core thesis and evidence framework',
        percentage: 50,
    },
    COLLECTION: {
        name: 'Precision Evidence Collection',
        description: 'Targeted gathering of specific supporting data',
        percentage: 70,
    },
    PRESENTATION: {
        name: 'Final Output & Delivery',
        description: 'Reviewing, formatting, and exporting the final report',
        percentage: 90,
    },
};


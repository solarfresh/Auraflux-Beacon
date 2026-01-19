import { useInitiativeStore } from '@/stores/initiation';
import { useExplorationStore } from '@/stores/exploration';
import { getStabilityContext } from '@/logic/workflow';
import type { ConceptNode } from '@/interfaces/conceptual-map';

export function useWorkflowSync() {
  const initStore = useInitiativeStore();
  const expoStore = useExplorationStore();

  /**
   * ACTION: Transition from Definition to Canvas
   * Merges keywords into the physical registry without losing spatial data.
   */
  const syncToExploration = () => {
    // 1. Update Global Stability
    // expoStore.stabilityScore = initStore.stabilityScore;

    // 2. Incremental Sync of Keywords to Nodes
    // initStore.topicKeywords.forEach(kw => {
    //   const existingNode: ConceptNode = expoStore.conceptualNodes.find(n => n.type === 'CONCEPT' && n.keywordId === kw.id) as ConceptNode;

    //   if (existingNode) {
    //     // Sync semantic updates (e.g., user renamed a keyword in initiation)
    //     existingNode.label = kw.label;
    //     existingNode.domainStatus = kw.entityStatus;
    //   } else {
    //     // Create new physical entity for new keywords
    //     // createConceptNode is a helper to ensure all BaseNode properties are set
    //     expoStore.addNodeFromKeyword(kw, initStore.stabilityScore);
    //   }
    // });

    // 3. Cleanup: Remove nodes whose keywords were deleted in initiation
    // const currentKeywordIds = initStore.topicKeywords.map(k => k.id);
    // expoStore.conceptualNodes = expoStore.conceptualNodes.filter(node =>
    //   node.type !== 'CONCEPT' || currentKeywordIds.includes(node.keywordId)
    // );
  };

  /**
   * ACTION: Transition from Canvas back to Definition
   * Feeds physical findings back to the semantic layer.
   */
  const syncToInitiation = () => {
    // Reflect the grounded stability back to the source
    initStore.stabilityScore = expoStore.stabilityScore;

    // Additional logic: If a node became critical on canvas,
    // we could tag the keyword in initiation store for revision.
  };

  return {
    syncToExploration,
    syncToInitiation
  };
}
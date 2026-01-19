import { useInitiativeStore } from '@/stores/initiation';
import { useExplorationStore } from '@/stores/exploration';
import { getNodeGroundednessContext } from '@/logic/workflow';
import { v4 as uuidv4 } from 'uuid';

export function useWorkflowSync() {
  const initStore = useInitiativeStore();
  const expoStore = useExplorationStore();

  const syncInitiationToExploration = () => {
    convertRefinedTopicToSidebarNodes();
  };

  /**
   * ACTION: Transition from Canvas back to Definition
   * Feeds physical findings back to the semantic layer.
   */
  const syncExplorationToInitiation = () => {
    // Reflect the grounded stability back to the source
    initStore.stabilityScore = expoStore.stabilityScore;

    // Additional logic: If a node became critical on canvas,
    // we could tag the keyword in initiation store for revision.
  };


  const convertRefinedTopicToSidebarNodes = () => {
    expoStore.conceptualNodes = [];

    initStore.topicKeywords.map((processedKeyword) => {
      expoStore.conceptualNodes.push({
        id: uuidv4(),
        type: 'CONCEPT',
        groundedness: 10,
        canvases: [],
        solidity: getNodeGroundednessContext(10).solidity,
        label: processedKeyword.label,
        keywordId: processedKeyword.id,
        data: processedKeyword
      })
    });

    initStore.topicScope.map((processedScope) => {
      expoStore.conceptualNodes.push({
        id: uuidv4(),
        type: 'GROUP',
        groundedness: 10,
        canvases: [],
        solidity: getNodeGroundednessContext(10).solidity,
        label: processedScope.label,
        topicScopeId: processedScope.id,
        childNodeIds: [],
        size: {width: 0, height: 0},
        data: processedScope
      })
    });

    initStore.reflectionLogs.map((log) => {
      expoStore.conceptualNodes.push({
        id: uuidv4(),
        type: 'INSIGHT',
        groundedness: 10,
        canvases: [],
        solidity: getNodeGroundednessContext(10).solidity,
        label: log.title,
        reflectionId: log.id,
        data: log
      })
    });

    expoStore.conceptualNodes.push({
      id: uuidv4(),
      type: 'FOCUS',
      groundedness: 10,
      canvases: [],
      solidity: getNodeGroundednessContext(10).solidity,
      label: initStore.finalQuestion,
    });

    console.log(expoStore.conceptualNodes)
  }

  return {
    syncInitiationToExploration,
    syncExplorationToInitiation
  };
}
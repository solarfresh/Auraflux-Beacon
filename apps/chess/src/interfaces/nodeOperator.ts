import type { ActionDefinition } from '@auraflux/design-system/interfaces/navs';

export type NodeActionDefinition = ActionDefinition;

export interface NodeOperatorAction {
  actionType: 'DecompositionAgent' | 'HypothesisAnalysisAgent' | 'BoundaryAgent' | 'LogicCritiqueAgent'
  nodeType: string
  payload: Record<string, any>
}

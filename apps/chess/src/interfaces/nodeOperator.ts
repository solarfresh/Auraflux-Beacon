export type ActionType =
  | 'DecompositionAgent'
  | 'HypothesisAnalysisAgent'
  | 'BoundaryAgent'
  | 'LogicCritiqueAgent';

export interface NodeOperatorRequest {
  nodeId: string;
  actionType: ActionType;
}

export interface NodeOperatorResponse {
  status: string;
  data: Record<string, any>;
  timestamp: string;
}

import type { ConceptualEdge, ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { ID, ProcessStatus } from '@auraflux/design-system/interfaces/core';

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

export type NodeOperatorWebSocketEventType = 'node_action_persisted' | 'broadcast_event';

export interface NodeOperatorWebSocketEvent {
  type: 'send_notification';
  event_type: NodeOperatorWebSocketEventType;
  payload: {
    status: ProcessStatus;
    payload: {
      canvas_id: ID;
      session_id?: ID;
      persisted_nodes?: ConceptualNode[];
      persisted_edges?: ConceptualEdge[];
      error?: string;
    };
  };
}

export interface ErrorWebSocketPayload {
  type: 'send_notification';
  event_type: NodeOperatorWebSocketEventType;
  payload: {
    status: ProcessStatus;
    payload: {
      canvas_id: ID;
      session_id?: ID;
      error: string;
    };
  };
}

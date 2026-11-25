import { ChessEndpoints } from '@/api/endpoints';
import type { BatchUpdateNodePositionRequest, CanvasGraphResponse, ConceptualEdge, ConceptualNode, CreateEdgeRequest, CreateNodeRequest, UpdateEdgeRequest, UpdateNodeRequest } from '@/interfaces/canvases';
import type { NodeOperatorRequest, NodeOperatorResponse } from '@/interfaces/nodeOperator';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import config from '@auraflux/shared-core/config';
import { AxiosResponse } from 'axios';

const AURAFLUX_CHESS_CLIENT_ID = config.AURAFLUX_CHESS_CLIENT_ID

export const apiService = {
  canvases: {
    async getGraph(canvasId: ID): Promise<AxiosResponse<CanvasGraphResponse>> {
      return apiClient.get<CanvasGraphResponse>(ChessEndpoints.canvases.getGraph(canvasId), {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async createNode(canvasId: ID, payload: CreateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.post<ConceptualNode>(ChessEndpoints.canvases.nodeList(canvasId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async updateNode(canvasId: ID, nodeId: ID, payload: UpdateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.put<ConceptualNode>(ChessEndpoints.canvases.nodeDetail(canvasId, nodeId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async batchUpdateNodePositions(canvasId: ID, payload: BatchUpdateNodePositionRequest): Promise<AxiosResponse<void>> {
      return apiClient.patch<void>(ChessEndpoints.canvases.batchUpdateNodePositions(canvasId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async createEdge(canvasId: ID, payload: CreateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.post(ChessEndpoints.canvases.getEdges(canvasId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async updateEdge(canvasId: ID, edgeId: ID, payload: UpdateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.put(ChessEndpoints.canvases.edgeDetail(canvasId, edgeId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async deleteNode(canvasId: ID, nodeId: ID): Promise<AxiosResponse<void>> {
      return apiClient.delete<void>(ChessEndpoints.canvases.nodeDetail(canvasId, nodeId), {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async deleteEdge(canvasId: ID, edgeId: ID): Promise<AxiosResponse<void>> {
      return apiClient.delete<void>(ChessEndpoints.canvases.edgeDetail(canvasId, edgeId), {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
    async triggerNodeOperator(canvasId: ID, nodeId: ID, payload: NodeOperatorRequest): Promise<AxiosResponse<NodeOperatorResponse>> {
      return apiClient.post<NodeOperatorResponse>(ChessEndpoints.canvases.nodeActions(canvasId, nodeId), payload, {
        serviceScope: AURAFLUX_CHESS_CLIENT_ID,
      });
    },
  },
};

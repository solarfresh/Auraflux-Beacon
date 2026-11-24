import { ChessEndpoints } from '@/api/endpoints';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import { AxiosResponse } from 'axios';
import type { CreateNodeRequest, UpdateNodeRequest, UpdateEdgeRequest, ConceptualNode, CreateEdgeRequest, ConceptualEdge, CanvasGraphResponse, BatchUpdateNodePositionRequest } from '@/interfaces/canvases';
import type { NodeOperatorRequest, NodeOperatorResponse } from '@/interfaces/nodeOperator';


export const apiService = {
  canvases: {
    async getGraph(canvasId: ID): Promise<AxiosResponse<CanvasGraphResponse>> {
      return apiClient.get<CanvasGraphResponse>(ChessEndpoints.canvases.getGraph(canvasId));
    },
    async createNode(canvasId: ID, payload: CreateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.post<ConceptualNode>(ChessEndpoints.canvases.nodeList(canvasId), payload);
    },
    async updateNode(canvasId: ID, nodeId: ID, payload: UpdateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.put<ConceptualNode>(ChessEndpoints.canvases.nodeDetail(canvasId, nodeId), payload);
    },
    async batchUpdateNodePositions(canvasId: ID, payload: BatchUpdateNodePositionRequest): Promise<AxiosResponse<void>> {
      return apiClient.patch<void>(ChessEndpoints.canvases.batchUpdateNodePositions(canvasId), payload);
    },
    async createEdge(canvasId: ID, payload: CreateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.post(ChessEndpoints.canvases.getEdges(canvasId), payload);
    },
    async updateEdge(canvasId: ID, edgeId: ID, payload: UpdateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.put(ChessEndpoints.canvases.edgeDetail(canvasId, edgeId), payload);
    },
    async deleteNode(canvasId: ID, nodeId: ID): Promise<AxiosResponse<void>> {
      return apiClient.delete<void>(ChessEndpoints.canvases.nodeDetail(canvasId, nodeId));
    },
    async deleteEdge(canvasId: ID, edgeId: ID): Promise<AxiosResponse<void>> {
      return apiClient.delete<void>(ChessEndpoints.canvases.edgeDetail(canvasId, edgeId));
    },
    async triggerNodeOperator(canvasId: ID, nodeId: ID, payload: NodeOperatorRequest): Promise<AxiosResponse<NodeOperatorResponse>> {
      return apiClient.post<NodeOperatorResponse>(ChessEndpoints.canvases.nodeActions(canvasId, nodeId), payload);
    },
  },
};

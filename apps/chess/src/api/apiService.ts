import { ChessEndpoints } from '@/api/endpoints';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import { AxiosResponse } from 'axios';
import type { CreateNodeRequest, UpdateNodeRequest, ConceptualNode, CreateEdgeRequest, ConceptualEdge, CanvasGraphResponse } from '@/interfaces/canvases';


export const apiService = {
  canvases: {
    async getGraph(canvasId: ID): Promise<AxiosResponse<CanvasGraphResponse>> {
      return apiClient.get<CanvasGraphResponse>(ChessEndpoints.canvases.getGraph(canvasId));
    },
    async createNode(canvasId: ID, payload: CreateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.post<ConceptualNode>(ChessEndpoints.canvases.createNode(canvasId), payload);
    },
    async updateNode(canvasId: ID, nodeId: ID, payload: UpdateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.put<ConceptualNode>(ChessEndpoints.canvases.nodeDetail(canvasId, nodeId), payload);
    },
    async createEdge(canvasId: ID, payload: CreateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.post(ChessEndpoints.canvases.getEdges(canvasId), payload);
    },
  },
};

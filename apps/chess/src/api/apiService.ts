import { ChessEndpoints } from '@/api/endpoints';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import { AxiosResponse } from 'axios';
import type { CreateNodeRequest, ConceptualNode, CreateEdgeRequest, ConceptualEdge } from '@/interfaces/canvases';


export const apiService = {
  canvases: {
    async createNode(canvasId: ID, payload: CreateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.post<ConceptualNode>(ChessEndpoints.canvases.createNode(canvasId), payload);
    },
    async createEdge(canvasId: ID, payload: CreateEdgeRequest): Promise<AxiosResponse<ConceptualEdge>> {
      return apiClient.post(ChessEndpoints.canvases.getEdges(canvasId), payload);
    },
  },
};

import { ChessEndpoints } from '@/api/endpoints';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiClient } from '@auraflux/shared-core/api/apiClient';
import { AxiosResponse } from 'axios';
import type { CreateNodeRequest, ConceptualNode } from '@/interfaces/node';


export const apiService = {
  canvases: {
    async createNode(canvasId: ID, payload: CreateNodeRequest): Promise<AxiosResponse<ConceptualNode>> {
      return apiClient.post<ConceptualNode>(ChessEndpoints.canvases.createNode(canvasId), payload);
    },
  },
};

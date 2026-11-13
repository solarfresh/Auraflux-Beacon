import { ID } from '@auraflux/design-system/interfaces/core';
import config from '@auraflux/shared-core/config';

const AURAFLUX_CHESS_URL = config.AURAFLUX_CHESS_URL;

export const ChessEndpoints = {
  canvases: {
    getGraph: (canvasId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/`,
    getNodes: (canvasId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/nodes/`,
    createNode: (canvasId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/nodes/`,
    batchUpdateNodePositions: (canvasId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/nodes/batch-position/`,
    nodeDetail: (canvasId: ID, nodeId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/nodes/${nodeId}/`,
    getEdges: (canvasId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/edges/`,
    edgeDetail: (canvasId: ID, edgeId: ID): string => `${AURAFLUX_CHESS_URL}/api/v1/canvases/${canvasId}/edges/${edgeId}/`,
  },
};

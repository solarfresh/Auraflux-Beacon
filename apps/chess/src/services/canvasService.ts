import { apiService } from '@/api/apiService';
import type { ConceptualEdge, ConceptualNode, NodeType, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';
import type { EntityStatus, ID } from '@auraflux/design-system/interfaces/core';

export class CanvasService {
  private canvasId: string;

  constructor(canvasId: string = 'default-canvas') {
    this.canvasId = canvasId;
  }

  public setCanvasId(id: string) {
    this.canvasId = id;
  }

  public async createNode(nodeData: Partial<ConceptualNode>): Promise<ConceptualNode | null> {
    try {
      const response = await apiService.canvases.createNode(this.canvasId, {
        label: nodeData.label || 'New Node',
        type: nodeData.type || 'CONCEPT',
        position: nodeData.position || { x: 100, y: 100 }
      });

      if (response && response.data) {
        return {
          id: response.data.id as ID,
          label: response.data.label,
          type: response.data.type as NodeType,
          content: response.data.content,
          sourceRef: response.data.sourceRef,
          rationale: response.data.rationale,
          position: response.data.position,
          status: response.data.status as EntityStatus,
          handles: response.data.handles
        };
      }
      return null;
    } catch (error) {
      console.error('CanvasService.createNode error:', error);
      throw error;
    }
  }

  public async addNode(
    instanceId: ID | undefined,
    addNodeToContext: (node: ConceptualNode) => void,
    removeNodeFromContext: (id: ID) => void
  ): Promise<void> {
    const tempId = `temp-${Date.now()}`;
    const newNode: ConceptualNode = {
      id: tempId,
      label: 'New Node',
      type: 'CONCEPT',
      position: { x: 100, y: 100 },
      status: 'DRAFT'
    };

    addNodeToContext(newNode);

    try {
      this.setCanvasId(instanceId || 'default-canvas');
      const createdNode = await this.createNode(newNode);

      if (createdNode) {
        removeNodeFromContext(tempId);
        addNodeToContext(createdNode);
      }
    } catch (error) {
      console.error('NodeCreationError:', error);
      removeNodeFromContext(tempId);
    }
  }

  public async duplicateNode(
    node: ConceptualNode,
    instanceId: ID | undefined,
    addNodeToContext: (node: ConceptualNode) => void,
    removeNodeFromContext: (id: ID) => void
  ): Promise<void> {
    const tempId = `temp-${Date.now()}`;
    const duplicatedNode: ConceptualNode = {
      ...node,
      id: tempId,
      label: `${node.label} (Copy)`,
      position: {
        x: (node.position?.x || 0) + 50,
        y: (node.position?.y || 0) + 50
      },
      status: 'DRAFT'
    };

    addNodeToContext(duplicatedNode);

    try {
      this.setCanvasId(instanceId || 'default-canvas');
      const createdNode = await this.createNode(duplicatedNode);

      if (createdNode) {
        removeNodeFromContext(tempId);
        addNodeToContext(createdNode);
      }
    } catch (error) {
      console.error('NodeDuplicationError:', error);
      removeNodeFromContext(tempId);
    }
  }

  public async updateNode(_nodeId: ID, _nodeData: Partial<ConceptualNode>): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('CanvasService.updateNode error:', error);
      return false;
    }
  }

  public async deleteNode(_nodeId: ID): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('CanvasService.deleteNode error:', error);
      return false;
    }
  }

  public async createEdge(
    sourceId: ID,
    targetId: ID,
    edges: ConceptualEdge[]
  ): Promise<ConceptualEdge | null> {
    try {
      if (sourceId === targetId) {
        throw new Error('Self-loop connection is not allowed');
      }

      const isDuplicate = edges.some(
        (e) => e.source === sourceId && e.target === targetId
      );
      if (isDuplicate) {
        throw new Error('Duplicate edge is not allowed');
      }

      const response = await apiService.canvases.createEdge(this.canvasId, {
        source: sourceId as ID,
        target: targetId as ID,
        type: 'LINK',
        weight: 1
      });

      if (response && response.data) {
        return {
          id: response.data.id as ID,
          source: response.data.source as ID,
          target: response.data.target as ID,
          type: response.data.type as EdgeType,
          weight: response.data.weight as number,
          label: response.data.label,
          status: response.data.status,
          evidence: response.data.evidence,
          rationale: response.data.rationale,
          metadata: response.data.metadata,
          sourceHandle: response.data.sourceHandle,
          targetHandle: response.data.targetHandle
        } as ConceptualEdge;
      }
      return null;
    } catch (error) {
      console.error('CanvasService.createEdge error:', error);
      throw error;
    }
  }
}

export const canvasService = new CanvasService();

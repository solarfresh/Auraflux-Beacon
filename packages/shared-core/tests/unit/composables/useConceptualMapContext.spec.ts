/**
 * @file useConceptualMapContext.spec.ts
 * @description Unit tests for useConceptualMapContext composable in shared-core.
 */

import { describe, it, expect } from 'vitest';
import { useConceptualMapContext } from '@auraflux/shared-core/composables/useConceptualMapContext';
import type { Position } from '@vue-flow/core';

describe('useConceptualMapContext', () => {
  it('should initialize with default empty or base state', () => {
    const { instance } = useConceptualMapContext();
    expect(instance.conceptualNodes).toBeDefined();
    expect(instance.conceptualEdges).toEqual([]);
    expect(instance.isDragging).toBe(false);
  });

  it('should successfully add and remove nodes', () => {
    const { instance, addNode, removeNode } = useConceptualMapContext();
    const testNode = {
      id: 'node-1',
      type: 'CONCEPT' as const,
      position: { x: 100, y: 200 },
      label: 'Test Node',
      handles: [
        {
          id: 'h-source-node-1',
          type: 'source' as const,
          position: 'right' as Position,
        },
        {
          id: 'h-target-node-1',
          type: 'target' as const,
          position: 'left' as Position,
        },
      ],
    };

    addNode(testNode);
    expect(instance.conceptualNodes.size).toBe(1);
    expect(instance.conceptualNodes.get('node-1')).toEqual(testNode);

    removeNode('node-1');
    expect(instance.conceptualNodes.size).toBe(0);
  });

  it('should successfully update existing nodes with partial data and preserve position defensively', () => {
    const { instance, addNode, updateNode } = useConceptualMapContext();
    const testNode = {
      id: 'node-1',
      label: 'Original',
      type: 'CONCEPT',
      position: { x: 150, y: 250 },
    };

    addNode(testNode as any);

    // Update only label, position should remain unchanged
    updateNode('node-1', { label: 'Updated Label' } as any);
    const node = instance.conceptualNodes.get('node-1');
    expect(node?.label).toBe('Updated Label');
    expect(node?.position).toEqual({ x: 150, y: 250 });

    // Update with new position
    updateNode('node-1', { position: { x: 300, y: 400 } } as any);
    const nodeMoved = instance.conceptualNodes.get('node-1');
    expect(nodeMoved?.position).toEqual({ x: 300, y: 400 });
  });

  it('should handle updating non-existent nodes safely without throwing errors', () => {
    const { instance, updateNode } = useConceptualMapContext();
    expect(() => {
      updateNode('non-existent-id', { label: 'Should Not Crash' } as any);
    }).not.toThrow();
    expect(instance.conceptualNodes.size).toBe(0);
  });

  it('should successfully add edges', () => {
    const { instance, addEdge } = useConceptualMapContext();
    const testEdge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'LINK',
    };

    addEdge(testEdge as any);
    expect(instance.conceptualEdges.length).toBe(1);
    expect(instance.conceptualEdges[0]).toEqual(testEdge);
  });

  it('should manage node selection state correctly', () => {
    const { selectedNodeId, selectNode, deselectAllNodes, isNodeSelected } = useConceptualMapContext();
    expect(selectedNodeId.value).toBeNull();

    selectNode('node-1');
    expect(selectedNodeId.value).toBe('node-1');
    expect(isNodeSelected('node-1')).toBe(true);
    expect(isNodeSelected('node-2')).toBe(false);

    deselectAllNodes();
    expect(selectedNodeId.value).toBeNull();
    expect(isNodeSelected('node-1')).toBe(false);
  });

  it('should manage edge selection and mutual exclusion with node selection', () => {
    const {
      selectedNodeId,
      selectedEdgeId,
      selectNode,
      selectEdge,
      deselectAll
    } = useConceptualMapContext();

    // 1. Select node -> clears edge
    selectNode('node-1');
    expect(selectedNodeId.value).toBe('node-1');
    expect(selectedEdgeId.value).toBeNull();

    // 2. Select edge -> clears node (mutual exclusion)
    selectEdge('edge-1');
    expect(selectedEdgeId.value).toBe('edge-1');
    expect(selectedNodeId.value).toBeNull();

    // 3. Select node again -> clears edge
    selectNode('node-2');
    expect(selectedNodeId.value).toBe('node-2');
    expect(selectedEdgeId.value).toBeNull();

    // 4. Deselect all clears both
    deselectAll();
    expect(selectedNodeId.value).toBeNull();
    expect(selectedEdgeId.value).toBeNull();
  });

  it('should successfully remove an edge', () => {
    const { instance, addEdge, removeEdge } = useConceptualMapContext();
    addEdge({ id: 'edge-1', source: 'n1', target: 'n2', type: 'LINK' } as any);
    addEdge({ id: 'edge-2', source: 'n2', target: 'n3', type: 'LINK' } as any);
    expect(instance.conceptualEdges.length).toBe(2);

    removeEdge('edge-1');
    expect(instance.conceptualEdges.length).toBe(1);
    expect(instance.conceptualEdges[0].id).toBe('edge-2');
  });

  it('should reset selectedEdgeId if the removed edge was selected', () => {
    const { selectedEdgeId, selectEdge, removeEdge } = useConceptualMapContext();
    selectEdge('edge-1');
    expect(selectedEdgeId.value).toBe('edge-1');
    removeEdge('edge-1');
    expect(selectedEdgeId.value).toBeNull();
  });

  it('should not throw if removing a non-existent edge', () => {
    const { removeEdge } = useConceptualMapContext();
    expect(() => removeEdge('non-existent')).not.toThrow();
  });

  it('should cascade remove edges connected to deleted node', () => {
    const { instance, addNode, addEdge, removeNode } = useConceptualMapContext();
    addNode({ id: 'node-1', label: 'Node 1', type: 'CONCEPT', position: { x: 0, y: 0 } });
    addNode({ id: 'node-2', label: 'Node 2', type: 'CONCEPT', position: { x: 10, y: 10 } });
    addEdge({ id: 'edge-1', source: 'node-1', target: 'node-2', type: 'LINK', weight: 1 });
    addEdge({ id: 'edge-2', source: 'node-2', target: 'node-3', type: 'LINK', weight: 1 });

    expect(instance.conceptualEdges.length).toBe(2);

    removeNode('node-1');
    expect(instance.conceptualNodes.has('node-1')).toBe(false);
    // edge-1 connected to node-1 should be removed, edge-2 should remain
    expect(instance.conceptualEdges.length).toBe(1);
    expect(instance.conceptualEdges[0].id).toBe('edge-2');
  });
});


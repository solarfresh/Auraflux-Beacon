/**
 * useCanvasDrop.ts
 * Manages the orchestration of external items being dragged onto the workspace.
 */
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';
import { useExplorationStore } from '@/stores/exploration';

export function useCanvasDrop() {
  const store = useExplorationStore();

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  const onDragStart = (event: DragEvent, node: ConceptualNode) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
      event.dataTransfer.effectAllowed = 'move'
    }

    store.isDragging = true;
    store.draggedNode = node;
    document.addEventListener('drop', onDragEnd)
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault(); // Required to allow drop
    if (!store.isDragOver) store.isDragOver = true;

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDragLeave = (event: DragEvent) => {
    store.isDragOver = false;
  };

  const onDragEnd = () => {
    store.isDragging = false;
    store.isDragOver = false;
    store.draggedNode = null;
    document.removeEventListener('drop', onDragEnd)
  };

  const onDrop = (event: DragEvent) => {
    if (store.draggedNode === null) return;

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const node = store.draggedNode;

    const newNode = {
      id: node?.id,
      // type: node?.type,
      type: 'default',
      position,
      data: { ...node },
    }

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(node.id, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
      }))

      off()
    })

    addNodes(newNode)
  }

  return {
    onDragStart,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop
  };
}
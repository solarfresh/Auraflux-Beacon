/**
 * useCanvasDrop.ts
 * Manages the orchestration of external items being dragged onto the workspace.
 */
import { inject } from 'vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { useVueFlow } from '@vue-flow/core';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

export function useCanvasDrop() {
  const context = inject(ConceptualMapContextKey);
  if (!context) {
    throw new Error(
      '[Architectural Violation] useCanvasDrop must be invoked within the subtree of a <ConceptualMapCanvas>.'
    );
  }

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  const onDragStart = (event: DragEvent, node: ConceptualNode) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
      event.dataTransfer.effectAllowed = 'move'
    }

    context.isDragging.value = true;
    context.draggedNode.value = node;
    document.addEventListener('drop', onDragEnd)
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault(); // Required to allow drop
    if (!context.isDragOver.value) context.isDragOver.value = true;

    if (event.dataTransfer && event.dataTransfer.dropEffect !== 'move') {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDragLeave = (event: DragEvent) => {
    context.isDragOver.value = false;
  };

  const onDragEnd = () => {
    context.isDragging.value = false;
    context.isDragOver.value = false;
    context.draggedNode.value = null;
    document.removeEventListener('drop', onDragEnd)
  };

  const onDrop = (event: DragEvent) => {
    if (context.draggedNode.value === null) return;

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const node = context.draggedNode.value;

    const newNode = {
      id: node?.id,
      type: node?.type || 'default',
      position,
      data: {
        ...node,
        position // Sync the position back into the internal data
      },
    }

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = onNodesInitialized(() => {
      updateNode(node.id, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2
        },
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
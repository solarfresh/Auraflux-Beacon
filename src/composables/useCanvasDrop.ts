/**
 * useCanvasDrop.ts
 * Manages the orchestration of external items being dragged onto the workspace.
 */
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { useVueFlow } from '@vue-flow/core';
import { ref } from 'vue';

export function useCanvasDrop() {
  const isDragging = ref(false);
  const isDragOver = ref(false);
  const draggedNode = ref<ConceptualNode | null>(null);

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  const onDragStart = (event: DragEvent, node: ConceptualNode) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
      event.dataTransfer.effectAllowed = 'move'
    }

    isDragging.value = true;
    draggedNode.value = node;
    document.addEventListener('drop', onDragEnd)
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault(); // Required to allow drop
    if (!isDragOver.value) isDragOver.value = true;

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDragLeave = () => {
    isDragOver.value = false;
  };

  const onDragEnd = () => {
    isDragging.value = false;
    isDragOver.value = false;
    draggedNode.value = null;
    document.removeEventListener('drop', onDragEnd)
  };

  const onDrop = (event: DragEvent) => {
    if (draggedNode.value === null) return;

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const node = draggedNode.value;

    const newNode = {
      id: node?.id,
      type: node?.type,
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
    isDragging,
    isDragOver,
    draggedNode,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop
  };
}
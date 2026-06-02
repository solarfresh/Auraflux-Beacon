/**
 * @file useCanvasDrop.ts
 * @description Statefully managed Drag-and-Drop Bridge for Vue Flow.
 * Merges cross-boundary streaming tunnels into a zero-side-effect reactive interface,
 * completely decoupled from DOM listeners and page stores.
 */
import { ref, inject } from 'vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import { useVueFlow } from '@vue-flow/core';
import { ConceptualMapContextKey } from '@/constants/injection-keys';

const tunnelDraggedNode = ref<ConceptualNode | null>(null);
const isTunnelDragging = ref(false);

export function useCanvasDrop(explicitContext?: any) {
  const context = explicitContext || inject(ConceptualMapContextKey, null);

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  const onDragStart = (event: DragEvent, node: ConceptualNode) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', JSON.stringify(node))
      event.dataTransfer.effectAllowed = 'move'
    }

    tunnelDraggedNode.value = node;
    isTunnelDragging.value = true;

    if (context) {
      context.isDragging.value = true;
      context.draggedNode.value = node;
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault(); // Required to allow drop
    if (!context) return;

    if (!context.isDragOver.value) context.isDragOver.value = true;

    context.isDragging.value = isTunnelDragging.value;
    context.draggedNode.value = tunnelDraggedNode.value;

    if (event.dataTransfer && event.dataTransfer.dropEffect !== 'move') {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  const onDragLeave = (event: DragEvent) => {
    if (context) context.isDragOver.value = false;
  };

  const onDragEnd = () => {
    tunnelDraggedNode.value = null;
    isTunnelDragging.value = false;

    if (context) {
      context.isDragging.value = false;
      context.isDragOver.value = false;
      context.draggedNode.value = null;
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    let node = tunnelDraggedNode.value;
    if (!node) {
      const rawData = event.dataTransfer?.getData('application/vueflow');
      if (rawData) node = JSON.parse(rawData);
    }

    if (!node || !context) return;

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

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
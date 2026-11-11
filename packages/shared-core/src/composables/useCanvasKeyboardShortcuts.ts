import { onMounted, onUnmounted, getCurrentInstance } from 'vue';
import type { ID } from '@auraflux/design-system/interfaces/core';

interface UseCanvasKeyboardShortcutsOptions {
  selectedNodeId: { value: ID | null };
  selectedEdgeId: { value: ID | null };
  removeNode: (nodeId: ID) => void;
  removeEdge: (edgeId: ID) => void;
}

export function useCanvasKeyboardShortcuts(options: UseCanvasKeyboardShortcutsOptions) {
  const { selectedNodeId, selectedEdgeId, removeNode, removeEdge } = options;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (selectedNodeId.value) {
        removeNode(selectedNodeId.value);
      } else if (selectedEdgeId.value) {
        removeEdge(selectedEdgeId.value);
      }
    }
  };

  if (getCurrentInstance()) {
    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  } else {
    window.addEventListener('keydown', handleKeyDown);
  }
}

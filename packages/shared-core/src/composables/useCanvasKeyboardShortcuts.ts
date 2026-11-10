import { onMounted, onUnmounted, getCurrentInstance } from 'vue';
import type { ID } from '@auraflux/design-system/interfaces/core';

interface UseCanvasKeyboardShortcutsOptions {
  selectedNodeId: { value: ID | null };
  removeNode: (nodeId: ID) => void;
}

export function useCanvasKeyboardShortcuts(options: UseCanvasKeyboardShortcutsOptions) {
  const { selectedNodeId, removeNode } = options;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (selectedNodeId.value) {
        removeNode(selectedNodeId.value);
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

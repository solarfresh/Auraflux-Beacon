/**
 * @file useCanvasKeyboardShortcuts.spec.ts
 * @description Unit tests for useCanvasKeyboardShortcuts composable.
 */

import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCanvasKeyboardShortcuts } from '@auraflux/shared-core/composables/useCanvasKeyboardShortcuts';

describe('useCanvasKeyboardShortcuts', () => {
  it('triggers removeNode when Delete or Backspace is pressed and a node is selected', () => {
    const selectedNodeId = ref<string | null>('node-1');
    const removeNode = vi.fn();

    useCanvasKeyboardShortcuts({
      selectedNodeId,
      removeNode,
    });

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);

    expect(removeNode).toHaveBeenCalledWith('node-1');

    const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    window.dispatchEvent(backspaceEvent);

    expect(removeNode).toHaveBeenCalledTimes(2);
    expect(removeNode).toHaveBeenCalledWith('node-1');
  });

  it('guards against node deletion when typing inside input or textarea', () => {
    const selectedNodeId = ref<string | null>('node-1');
    const removeNode = vi.fn();

    useCanvasKeyboardShortcuts({
      selectedNodeId,
      removeNode,
    });

    const input = document.createElement('input');
    document.body.appendChild(input);

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    Object.defineProperty(deleteEvent, 'target', { value: input, enumerable: true });

    window.dispatchEvent(deleteEvent);

    expect(removeNode).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});

/**
 * @file useCanvasKeyboardShortcuts.spec.ts
 * @description Unit tests for useCanvasKeyboardShortcuts composable.
 */

import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCanvasKeyboardShortcuts } from '@auraflux/shared-core/composables/useCanvasKeyboardShortcuts';

describe('useCanvasKeyboardShortcuts', () => {
  it('triggers removeEdge when Delete or Backspace is pressed and an edge is selected', () => {
    const selectedNodeId = ref<string | null>(null);
    const selectedEdgeId = ref<string | null>('edge-1');
    const removeNode = vi.fn();
    const removeEdge = vi.fn();

    useCanvasKeyboardShortcuts({
      selectedNodeId,
      selectedEdgeId,
      removeNode,
      removeEdge,
    });

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);

    expect(removeEdge).toHaveBeenCalledWith('edge-1');

    const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    window.dispatchEvent(backspaceEvent);

    expect(removeEdge).toHaveBeenCalledTimes(2);
    expect(removeEdge).toHaveBeenCalledWith('edge-1');
  });

  it('triggers removeNode when Delete or Backspace is pressed and a node is selected', () => {
    const selectedNodeId = ref<string | null>('node-1');
    const selectedEdgeId = ref<string | null>(null);
    const removeNode = vi.fn();
    const removeEdge = vi.fn();

    useCanvasKeyboardShortcuts({
      selectedNodeId,
      selectedEdgeId,
      removeNode,
      removeEdge,
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
    const selectedEdgeId = ref<string | null>(null);
    const removeNode = vi.fn();
    const removeEdge = vi.fn();

    useCanvasKeyboardShortcuts({
      selectedNodeId,
      selectedEdgeId,
      removeNode,
      removeEdge,
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

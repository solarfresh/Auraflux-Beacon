import type { NodeType } from '@/interfaces/conceptual-map';
import { Position } from '@vue-flow/core'

export const POSITION_SCALE = 50.

/**
 * Node Visual Configuration
 * Maps each NodeType to its specific Tailwind CSS theme tokens.
 */
export const NODE_THEMES: Record<NodeType, {
  container: string;
  handle: string;
  badge: 'indigo' | 'amber' | 'emerald' | 'red' | 'gray' | 'purple' | 'blue' | 'slate';
}> = {
  // --- Empirical Core ---
  EVENT: {
    container: 'bg-amber-50 border-amber-100 text-amber-900',
    handle: 'bg-amber-400',
    badge: 'amber',
  },
  OUTCOME: {
    container: 'bg-red-50 border-red-100 text-red-900',
    handle: 'bg-red-400',
    badge: 'red',
  },
  BOUNDARY: {
    container: 'bg-slate-50 border-slate-200 text-slate-900',
    handle: 'bg-slate-400',
    badge: 'slate',
  },
  ENTITY: {
    container: 'bg-blue-50 border-blue-100 text-blue-900',
    handle: 'bg-blue-400',
    badge: 'blue',
  },

  // --- Canvas Functional ---
  FOCUS: {
    container: 'bg-indigo-100 border-indigo-300 text-indigo-900 shadow-md',
    handle: 'bg-indigo-500',
    badge: 'indigo',
  },
  RESOURCE: {
    container: 'bg-blue-50 border-blue-100 text-blue-900',
    handle: 'bg-blue-400',
    badge: 'blue',
  },
  CONCEPT: {
    container: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    handle: 'bg-emerald-400',
    badge: 'emerald',
  },
  INSIGHT: {
    container: 'bg-indigo-50 border-indigo-100 text-indigo-900',
    handle: 'bg-indigo-400',
    badge: 'indigo',
  },
  QUERY: {
    container: 'bg-amber-50 border-amber-100 text-amber-900',
    handle: 'bg-amber-400',
    badge: 'amber',
  },
  NAVIGATION: {
    container: 'bg-purple-50 border-purple-100 text-purple-900',
    handle: 'bg-purple-400',
    badge: 'purple',
  },
  GROUP: {
    container: 'bg-gray-50/50 border-dashed border-gray-300 text-gray-600',
    handle: 'bg-gray-300',
    badge: 'gray',
  },
};

export const HANDLE_MAP: Record<string, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  right: Position.Right,
  left: Position.Left,
}

export const ICON_MAP: Record<NodeType, string> = {
    EVENT: 'Calendar', OUTCOME: 'Flag', BOUNDARY: 'Shield', ENTITY: 'User',
    FOCUS: 'Target', RESOURCE: 'Cube', CONCEPT: 'LightBulb', INSIGHT: 'Sparkles',
    QUERY: 'QuestionMark', NAVIGATION: 'ArrowRight', GROUP: 'Collection'
  };

/**
 * Default connection line style for Vue Flow
 */
export const DEFAULT_EDGE_STYLE = {
  stroke: '#94a3b8',
  strokeWidth: 2,
};

/**
 * Zoom level constraints
 */
export const CANVAS_ZOOM_LIMITS = {
  MIN: 0.2,
  MAX: 4,
  DEFAULT: 1.2,
};
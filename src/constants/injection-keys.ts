/**
 * @file injection-keys.ts
 * @description Centralized repository for Vue Injection Keys within the conceptual map domain.
 * This file acts as an architectural breakwater to prevent circular dependency chains
 * (e.g., CanvasRoot -> Composable -> CanvasRoot) and enforces compile-time type safety
 * for the Provide/Inject reactive context.
 */

import type { InjectionKey } from 'vue';
import type { useConceptualMapContext } from '@/composables/useConceptualMapContext';

/**
 * Type inferred directly from the return value of the scoped context composable.
 * This guarantees that any changes to the reactive state structure in the composable
 * will automatically propagate to all consumer components injecting this key.
 */
export type ConceptualMapContextType = ReturnType<typeof useConceptualMapContext>;

/**
 * InjectionKey for the scoped canvas context.
 * Mandated for use within the root `ConceptualMapCanvas.vue` (Provider)
 * and downstream hooks/components like `useCanvasDrop.ts` and `useEdgeInterceptor.ts` (Consumers).
 *
 * @example
 * // Provider (Root)
 * provide(ConceptualMapContextKey, canvasContext);
 *
 * // Consumer (Hooks/Leaf Components)
 * const context = inject(ConceptualMapContextKey);
 */
export const ConceptualMapContextKey = Symbol('ConceptualMapContext') as InjectionKey<ConceptualMapContextType>;
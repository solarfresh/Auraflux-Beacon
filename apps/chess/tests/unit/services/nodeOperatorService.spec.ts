import '@/tests/mocks/apiService'

import { describe, it, expect } from 'vitest'
import { computeAvailableNodeActions } from '@/services/nodeOperatorService'
import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'

describe('nodeOperatorService', () => {
  const canvasId = 'canvas-123'

  it('should throw InvalidNodeSelectionError when node is null or not an object', () => {
    expect(() => computeAvailableNodeActions(null as any, canvasId)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions(undefined as any, canvasId)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions('not-an-object' as any, canvasId)).toThrow(InvalidNodeSelectionError)
  })

  it('should throw InvalidNodeSelectionError when type is missing', () => {
    expect(() => computeAvailableNodeActions({} as any, canvasId)).toThrow(InvalidNodeSelectionError)
  })

  it('should return actions disabled when node status is not ACTIVE', () => {
    const node = { id: 'node-1', label: 'Node 1', type: 'FOCUS', status: 'INACTIVE' } as any
    const actions = computeAvailableNodeActions(node, canvasId)
    expect(actions[0].disabled).toBe(true)
  })

  it('should return correct actions for FOCUS type', () => {
    const node = { id: 'node-1', label: 'Node 1', type: 'FOCUS', status: 'ACTIVE' } as any
    const actions = computeAvailableNodeActions(node, canvasId)
    expect(actions.length).toBe(2)
    expect(actions[0].id).toBe('DecompositionAgent')
  })

  it('should throw NodeOperatorNotSupportedError for unsupported type', () => {
    const node = { id: 'node-1', label: 'Node 1', type: 'UNKNOWN_TYPE', status: 'ACTIVE' } as any
    expect(() => computeAvailableNodeActions(node, canvasId)).toThrow(NodeOperatorNotSupportedError)
  })
})

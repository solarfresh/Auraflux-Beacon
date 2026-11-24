import '@/tests/mocks/apiService'

import { describe, it, expect } from 'vitest'
import { computeAvailableNodeActions } from '@/services/nodeOperatorService'
import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'

describe('nodeOperatorService', () => {
  const canvasId = 'canvas-123'

  it('should throw InvalidNodeSelectionError when node is null or not an object', () => {
    expect(() => computeAvailableNodeActions(null, canvasId)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions(undefined, canvasId)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions('not-an-object', canvasId)).toThrow(InvalidNodeSelectionError)
  })

  it('should throw InvalidNodeSelectionError when nodeType is missing', () => {
    expect(() => computeAvailableNodeActions({}, canvasId)).toThrow(InvalidNodeSelectionError)
  })

  it('should return actions disabled when node status is not ACTIVE', () => {
    const node = { id: 'node-1', nodeType: 'FOCUS', status: 'INACTIVE' }
    const actions = computeAvailableNodeActions(node, canvasId)
    expect(actions[0].disabled).toBe(true)
  })

  it('should return correct actions for FOCUS nodeType', () => {
    const node = { id: 'node-1', nodeType: 'FOCUS', status: 'ACTIVE' }
    const actions = computeAvailableNodeActions(node, canvasId)
    expect(actions.length).toBe(2)
    expect(actions[0].id).toBe('DecompositionAgent')
  })

  it('should throw NodeOperatorNotSupportedError for unsupported nodeType', () => {
    const node = { id: 'node-1', nodeType: 'UNKNOWN_TYPE', status: 'ACTIVE' }
    expect(() => computeAvailableNodeActions(node, canvasId)).toThrow(NodeOperatorNotSupportedError)
  })
})

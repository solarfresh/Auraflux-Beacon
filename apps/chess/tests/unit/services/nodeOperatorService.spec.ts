import { describe, it, expect } from 'vitest'
import { computeAvailableNodeActions } from '@/services/nodeOperatorService'
import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'

describe('nodeOperatorService', () => {
  it('should throw InvalidNodeSelectionError when node is null or not an object', () => {
    expect(() => computeAvailableNodeActions(null)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions(undefined)).toThrow(InvalidNodeSelectionError)
    expect(() => computeAvailableNodeActions('not-an-object')).toThrow(InvalidNodeSelectionError)
  })

  it('should throw InvalidNodeSelectionError when nodeType is missing', () => {
    expect(() => computeAvailableNodeActions({})).toThrow(InvalidNodeSelectionError)
  })

  it('should return empty array when node status is not ACTIVE', () => {
    const node = { nodeType: 'FOCUS', status: 'INACTIVE' }
    expect(computeAvailableNodeActions(node)).toEqual([])
  })

  it('should return correct actions for FOCUS nodeType', () => {
    const node = { nodeType: 'FOCUS', status: 'ACTIVE' }
    const actions = computeAvailableNodeActions(node)
    expect(actions).toEqual([
      { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles' },
      { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText' }
    ])
  })

  it('should return correct actions for INSIGHT nodeType', () => {
    const node = { nodeType: 'INSIGHT', status: 'ACTIVE' }
    const actions = computeAvailableNodeActions(node)
    expect(actions.length).toBe(4)
  })

  it('should throw NodeOperatorNotSupportedError for unsupported nodeType', () => {
    const node = { nodeType: 'UNKNOWN_TYPE', status: 'ACTIVE' }
    expect(() => computeAvailableNodeActions(node)).toThrow(NodeOperatorNotSupportedError)
  })
})

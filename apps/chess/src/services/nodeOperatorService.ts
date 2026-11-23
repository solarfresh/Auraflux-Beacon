import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'
import { NodeActionDefinition } from '@/interfaces/nodeOperator'

export function computeAvailableNodeActions(node: any): NodeActionDefinition[] {
  if (!node || typeof node !== 'object') {
    throw new InvalidNodeSelectionError('Invalid node selection: node must be a valid object')
  }

  if (!node.nodeType) {
    throw new InvalidNodeSelectionError('Invalid node selection: missing nodeType')
  }

  if (node.status !== 'ACTIVE') {
    return []
  }

  switch (node.nodeType) {
    case 'FOCUS':
    case 'CONCEPT':
      return [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles' },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText' }
      ]
    case 'INSIGHT':
    case 'EVENT':
      return [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles' },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText' },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation' },
        { id: 'LogicCritiqueAgent', label: 'Logic Critique', iconName: 'LightBulb' }
      ]
    case 'QUERY':
    case 'ENTITY':
      return [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles' },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText' },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation' }
      ]
    default:
      throw new NodeOperatorNotSupportedError(`Node operator not supported for type: ${node.nodeType}`)
  }
}

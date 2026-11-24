import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'
import { ActionDefinition } from '@auraflux/design-system/interfaces/navs'

export function computeAvailableNodeActions(node: any): ActionDefinition[] {
  if (!node || typeof node !== 'object') {
    throw new InvalidNodeSelectionError('Invalid node selection: node must be a valid object')
  }

  if (!node.nodeType) {
    throw new InvalidNodeSelectionError('Invalid node selection: missing nodeType')
  }

  const isActive = node.status === 'ACTIVE';

  let actions: ActionDefinition[] = [];

  switch (node.nodeType) {
    case 'FOCUS':
    case 'CONCEPT':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => console.log('Decomposition') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => console.log('Hypothesis') }
      ]
      break
    case 'INSIGHT':
    case 'EVENT':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => console.log('Decomposition') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => console.log('Hypothesis') },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation', onClick: () => console.log('Boundary') },
        { id: 'LogicCritiqueAgent', label: 'Logic Critique', iconName: 'LightBulb', onClick: () => console.log('Logic') }
      ]
      break
    case 'QUERY':
    case 'ENTITY':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => console.log('Decomposition') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => console.log('Hypothesis') },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation', onClick: () => console.log('Boundary') }
      ]
      break
    default:
      throw new NodeOperatorNotSupportedError(`Node operator not supported for type: ${node.nodeType}`)
  }

  return actions.map(action => ({
    ...action,
    disabled: !isActive
  }));
}

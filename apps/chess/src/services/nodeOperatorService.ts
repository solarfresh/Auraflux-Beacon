import { InvalidNodeSelectionError, NodeOperatorNotSupportedError } from '@/errors/nodeOperator'
import { ActionDefinition } from '@auraflux/design-system/interfaces/navs'
import { apiService } from '@/api/apiService'
import type { ID } from '@auraflux/design-system/interfaces/core'
import { ActionType } from '@/interfaces/nodeOperator'

export function computeAvailableNodeActions(
  node: any,
  canvasId: ID
): ActionDefinition[] {
  if (!node || typeof node !== 'object') {
    throw new InvalidNodeSelectionError('Invalid node selection: node must be a valid object')
  }

  if (!node.nodeType) {
    throw new InvalidNodeSelectionError('Invalid node selection: missing nodeType')
  }

  const isActive = node.status === 'ACTIVE';

  const triggerAction = async (actionType: ActionType) => {
    try {
      const response = await apiService.canvases.triggerNodeOperator(canvasId, node.id, {
        nodeId: node.id,
        actionType
      })
      return response.data
    } catch (error) {
      console.error('Failed to trigger operator:', error)
      throw error
    }
  }

  let actions: ActionDefinition[] = [];

  switch (node.nodeType) {
    case 'FOCUS':
    case 'CONCEPT':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => triggerAction('DecompositionAgent') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => triggerAction('HypothesisAnalysisAgent') }
      ]
      break
    case 'INSIGHT':
    case 'EVENT':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => triggerAction('DecompositionAgent') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => triggerAction('HypothesisAnalysisAgent') },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation', onClick: () => triggerAction('BoundaryAgent') },
        { id: 'LogicCritiqueAgent', label: 'Logic Critique', iconName: 'LightBulb', onClick: () => triggerAction('LogicCritiqueAgent') }
      ]
      break
    case 'QUERY':
    case 'ENTITY':
      actions = [
        { id: 'DecompositionAgent', label: 'Decomposition', iconName: 'Sparkles', onClick: () => triggerAction('DecompositionAgent') },
        { id: 'HypothesisAnalysisAgent', label: 'Hypothesis Analysis', iconName: 'DocumentText', onClick: () => triggerAction('HypothesisAnalysisAgent') },
        { id: 'BoundaryAgent', label: 'Boundary Check', iconName: 'ShieldExclamation', onClick: () => triggerAction('BoundaryAgent') }
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

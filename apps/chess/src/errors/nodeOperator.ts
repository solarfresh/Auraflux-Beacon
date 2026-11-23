export class InvalidNodeSelectionError extends Error {
  public errorType = 'InvalidNodeSelectionError'
  public timestamp: string

  constructor(message: string) {
    super(message)
    this.name = 'InvalidNodeSelectionError'
    this.timestamp = new Date().toISOString()
  }
}

export class NodeOperatorNotSupportedError extends Error {
  public errorType = 'NodeOperatorNotSupportedError'
  public timestamp: string

  constructor(message: string) {
    super(message)
    this.name = 'NodeOperatorNotSupportedError'
    this.timestamp = new Date().toISOString()
  }
}

export class CanvasLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanvasLoadError';
  }
}

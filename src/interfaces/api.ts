export interface FailedRequestQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}

export interface ProcessQueueItem {
  resolve: (value?: string) => void;
  reject: (error?: Error) => void;
}

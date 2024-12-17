export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  RETRYING = 'retrying'
}

export interface ApiState<T> {
  status: LoadingState;
  data: T | null;
  error: Error | null;
  retryCount: number;
}
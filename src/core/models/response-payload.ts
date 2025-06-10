export interface ResponsePayload<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: any;
}

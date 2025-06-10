import { ResponsePayload } from './response-payload';

export class HttpResponse<T> {
  private payload: ResponsePayload<T> = {};

  constructor(data?: T) {
    this.payload.data = data;
  }

  withMeta(meta: any): HttpResponse<T> {
    this.payload.meta = meta;
    return this;
  }

  withCode(statusCode: number) {
    this.payload.statusCode = statusCode;
    return this;
  }

  build(): ResponsePayload<T> {
    return this.payload;
  }
}

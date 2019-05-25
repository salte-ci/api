import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request extends ExpressRequest {
  auth: any;
}

export type Response = ExpressResponse;

export class RouteError extends Error {
  public code: string;
  public status: number;

  constructor(options: {
    message: string;
    code: string;
    status: number;
  }) {
    super(options.message);
    this.code = options.code;
    this.status = options.status;
  }
}

export interface Options<T> {
  body: {
    [key: string]: T;
  };

  params: {
    [key: string]: any;
  };
}

export interface SocketInterface<T> {
  route: string;

  basic?(payload: T): Promise<T>;
}

export class SocketError extends Error {
  public code: string;
  public statusCode: number;

  constructor(options: { message: string, code: string, statusCode: number }) {
    super(options.message);
    this.code = options.code;
    this.statusCode = options.statusCode;
  }
}

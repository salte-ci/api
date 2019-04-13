export interface Options<T> {
  body: {
    [key: string]: T;
  };

  params: {
    [key: string]: any;
  };
}

export interface RouteInterface<T> {
  route: string;
  get?(options: Options<T>): Promise<T>;
  post?(options: Options<T>): Promise<T>;
  put?(options: Options<T>): Promise<T>;
  delete?(options: Options<T>): Promise<void>;
}

export class RouteError extends Error {
  public code: string;
  public statusCode: number;

  constructor(options: { message: string, code: string, statusCode: number }) {
    super(options.message);
    this.code = options.code;
    this.statusCode = options.statusCode;
  }
}

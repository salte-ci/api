export interface Options {
  body: any;
  params: {
    [key: string]: any;
  };
}

export interface PostOptions<T> extends Options {
  body: T;
}

export interface PutOptions<T> extends Options {
  body: Partial<T>;
}

export interface DeleteOptions extends Options {
  body: number;
}

export interface HttpInterface<T> {
  route: string;
  get?(options: Options): Promise<T>;
  post?(options: PostOptions<T>): Promise<T>;
  put?(options: PutOptions<T>): Promise<T>;
  delete?(options: DeleteOptions): Promise<void>;
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

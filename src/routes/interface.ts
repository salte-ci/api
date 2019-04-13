export interface RouteInterface<T> {
  route: string;
  get?(): Promise<T>;
  post?(data: T): Promise<T>;
  put?(data: T): Promise<T>;
  delete?(): Promise<void>;
}

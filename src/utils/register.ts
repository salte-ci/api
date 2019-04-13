import { Router, RequestHandler } from 'express';
import { RouteInterface } from '../routes/interface';

export interface Options {
  body: {
    [key: string]: any;
  };

  params: {
    [key: string]: string | number | boolean;
  };
}

export function wrap(method: (options: Options) => Promise<any>): RequestHandler {
  return async (request, response, next) => {
    try {
      const result = await method({
        body: request.body,
        params: request.params
      });

      response.json(result).status(200).send();
    } catch (error) {
      next(error);
    }
  }
};

export function register(route: RouteInterface<any>) {
  const router = Router();
  const methods = Router();

  if (route.get) methods.get('/:id?', wrap(route.get));
  if (route.post) methods.post('/', wrap(route.post));
  if (route.put) methods.put('/:id?', wrap(route.put));
  if (route.delete) methods.delete('/:id?', wrap(route.delete));

  router.use(route.route, methods);

  return router;
}

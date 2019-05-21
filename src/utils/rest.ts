import { Router, RequestHandler, json } from 'express';
import { HttpInterface, Options } from '../routes/interface';
import { auth } from './auth';

export function wrap(method: (options: Options) => Promise<any>): RequestHandler {
  return async (request, response, next) => {
    try {
      const result = await method({
        body: request.body,
        params: request.params,
        auth: await auth(request)
      });

      response.json(result).status(200).send();
    } catch (error) {
      next(error);
    }
  }
};

export function rest(route: HttpInterface<any>) {
  const router = Router();
  router.use(json());

  if (route.get) router.get(`${route.route}/:id?`, wrap(route.get));
  if (route.post) router.post(`${route.route}/:id?`, wrap(route.post));
  if (route.put) router.put(`${route.route}/:id?`, wrap(route.put));
  if (route.delete) router.delete(`${route.route}/:id?`, wrap(route.delete));

  return router;
}

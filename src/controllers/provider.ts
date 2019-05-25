import { Controller, Get } from '@overnightjs/core';
import { Request, Response, RouteError } from './interface';
import { database } from '../models/database';

@Controller('providers')
export class ProviderController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<Response> {
    if (!req.auth) throw new RouteError({
      code: 'unauthorized',
      message: `Must be authenticated to view the active providers.`,
      status: 401
    });

    if (!req.auth['http://salte.io/groups'].includes('salte-ci-admin')) throw new RouteError({
      code: 'unauthorized',
      message: `This endpoint is restricted to administrators.`,
      status: 401
    });

    const { ProviderModel } = await database();

    const providers = await ProviderModel.scope('admin').findAll();

    return res.status(200).json(providers);
  }
}

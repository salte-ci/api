import { HttpInterface, Options, RouteError } from './interface';
import { database } from '../models/database';
import { ProviderModel } from '../models/provider';

export class ProviderRoute implements HttpInterface<ProviderModel> {
  public route = '/providers';

  public async get({ auth }: Options) {
    if (!auth) throw new RouteError({
      code: 'unauthorized',
      message: `Must be authenticated to view the active providers.`,
      status: 401
    });

    if (!auth['http://salte.io/groups'].includes('salte-ci-admin')) throw new RouteError({
      code: 'unauthorized',
      message: `This endpoint is restricted to administrators.`,
      status: 401
    });

    const { ProviderModel } = await database();

    return ProviderModel.scope('admin').findAll();
  }
}

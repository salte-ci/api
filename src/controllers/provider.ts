import { Controller, ChildControllers, Get } from '@overnightjs/core';
import { Request, Response, RouteError } from './interface';
import { database } from '../models/database';
import { InstallationController } from './installation';
import { config, computed } from '../shared/config';

@Controller('providers')
@ChildControllers([
  new InstallationController()
])
export class ProviderController {

  @Get('/')
  public async getProvider(req: Request, res: Response): Promise<Response> {
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

    return res.status(200).send(providers);
  }

  @Get(':name/descriptor')
  public async getDescriptor(req: Request, res: Response): Promise<Response> {
    const { ProviderModel } = await database();

    const provider = await ProviderModel.findOne({
      where: {
        name: req.params.name
      }
    });

    if (!provider) throw new RouteError({
      code: 'not_found',
      message: `Unable to find a provider for the given name. (${req.params.name})`,
      status: 404
    });

    if (provider.type !== 'bitbucket') throw new RouteError({
      code: 'invalid_provider',
      message: `The given provider isn't a 'bitbucket' provider.`,
      status: 400
    });

    return res.status(200).json({
      key: computed.name,
      name: 'Salte CI',
      description: 'The simplest and most versatile build platform in existence.',
      vendor: {
        name: 'Salte',
        url: config.PROVIDER_REDIRECT_URI
      },
      baseUrl: config.URL,
      authentication: {
        type: 'jwt'
      },
      lifecycle: {
        installed: '/installed',
        uninstalled: '/uninstalled'
      },
      modules: {
        webhooks: [{
          event: '*',
          url: `/providers/${provider.name}/hooks`
        }]
      },
      scopes: [
        'account'
      ],
      contexts: [
        'account'
      ]
    });
  }
}

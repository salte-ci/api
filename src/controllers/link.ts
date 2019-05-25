import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response, RouteError } from './interface';
import { database } from '../models/database';
import { ProviderModel } from '../models/provider';
import { providers } from '../providers';
import { logger } from '../shared/logger';

@Controller('links/:provider_name?')
export class LinkController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<Response> {
    if (!req.auth) throw new RouteError({
      code: 'unauthorized',
      message: `Must be authenticated to view linked accounts.`,
      status: 401
    });

    const { LinkedAccountModel } = await database();

    if (req.params.provider_name) {
      const link = await LinkedAccountModel.findOne({
        where: {
          account_id: req.auth.sub
        },
        include: [{
          model: ProviderModel,
          attributes: [],
          where: {
            name: req.params.provider_name
          }
        }]
      });

      if (!link) throw new RouteError({
        code: 'not_found',
        message: `Unable to find link for the given provider. (${req.params.provider_name})`,
        status: 404
      });

      return res.status(200).json(link);
    }

    return res.status(200).json(await LinkedAccountModel.findAll({
      where: {
        account_id: req.auth.sub
      }
    }));
  }

  @Post('/')
  public async post(req: Request, res: Response): Promise<Response> {
    if (!req.auth) throw new RouteError({
      code: 'unauthorized',
      message: `Must be authenticated to link new accounts.`,
      status: 401
    });

    const { provider_name } = req.params;

    if (!provider_name) throw new RouteError({
      code: 'invalid_provider_name',
      message: `The name of a provider must be given. (${provider_name})`,
      status: 400
    });

    const { LinkedAccountModel, ProviderModel } = await database();

    const provider = await ProviderModel.findOne({
      where: {
        name: provider_name
      }
    });

    if (!provider) throw new RouteError({
      code: 'not_found',
      message: `No provider exists for the given name. (${provider_name})`,
      status: 404
    });

    const Api = providers(provider.type);

    const { access_token, refresh_token } = await Api.token({
      url: provider.url,
      client_id: provider.client_id,
      client_secret: provider.client_secret,
      code: req.body.code
    });

    const api = new Api(provider.api_url, access_token);

    try {
      await api.validate();
    } catch (error) {
      logger.error(error);
      throw new RouteError({
        code: 'invalid_token',
        message: `Invalid token provided for the given provider. (${provider.name})`,
        status: 400
      });
    }

    await LinkedAccountModel.upsert({
      account_id: req.auth.sub,
      provider_id: provider.id,
      access_token,
      refresh_token
    });

    const link = await LinkedAccountModel.findOne({
      where: {
        account_id: req.auth.sub,
        provider_id: provider.id
      }
    });

    return res.status(200).json(link);
  }
}

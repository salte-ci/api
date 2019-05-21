import { HttpInterface, Options, RouteError } from './interface';
import { database } from '../models/database';
import { LinkedAccountModel } from '../models/linked-account';
import { providers } from '../providers';

export class LinkRoute implements HttpInterface<LinkedAccountModel> {
  public route = '/links';

  public async get({ auth, params }: Options) {
    const { LinkedAccountModel } = await database();

    if (params.id) {
      return LinkedAccountModel.findOne({
        where: {
          account_id: auth.sub,
          provider_id: params.id
        }
      });
    }

    return LinkedAccountModel.findAll({
      where: {
        account_id: auth.sub
      }
    });
  }

  public async post({ auth, body, params }: Options) {
    if (!auth) throw new RouteError({
      code: 'unauthorized',
      message: `Must be authenticated to link new accounts.`,
      status: 401
    });

    const { LinkedAccountModel, ProviderModel } = await database();

    const provider = await ProviderModel.findByPk(params.id);

    if (!provider) throw new RouteError({
      code: 'not_found',
      message: `No provider exists for the given id. (${params.id})`,
      status: 404
    });

    const Api = providers(provider.type);

    const { access_token, refresh_token } = await Api.token({
      url: provider.url,
      client_id: provider.client_id,
      client_secret: provider.client_secret,
      code: body.code
    });

    const api = new Api(provider.api_url, access_token);

    try {
      await api.validate();
    } catch (error) {
      console.error(error);
      throw new RouteError({
        code: 'invalid_token',
        message: `Invalid token provided for the given provider. (${provider.name})`,
        status: 400
      });
    }

    await LinkedAccountModel.upsert({
      account_id: auth.sub,
      provider_id: params.id,
      access_token,
      refresh_token
    });

    return LinkedAccountModel.findOne({
      where: {
        account_id: auth.sub,
        provider_id: params.id
      }
    });
  }
}

import { Request, Response } from 'express';
import { Controller, ClassOptions, Post } from '@overnightjs/core';
import { RouteError } from './interface';
import { database } from '../models/database';
import { providers } from '../providers';

@Controller(':provider_name/installations')
@ClassOptions({
  mergeParams: true
})
export class InstallationController {

  @Post(':installation_id')
  public async post(req: Request, res: Response): Promise<any> {
    const { ProviderModel, InstallationModel, RepositoryModel } = await database();

    const { provider_name, installation_id } = req.params;
    if (!provider_name) throw new RouteError({
      code: 'invalid_provider_name',
      message: `The name of a provider must be given. (${provider_name})`,
      status: 400
    });

    const provider = await ProviderModel.scope('admin').findOne({
      where: {
        name: provider_name
      }
    });

    const API = providers(provider.type);

    const token = await API.token({
      url: provider.api_url,
      private_key: provider.private_key,
      app_id: provider.app_id,
      installation_id: Number(installation_id)
    });

    const api = new API(provider.api_url, token.access_token);

    await api.validate();

    await InstallationModel.upsert({
      id: installation_id,
      provider_id: provider.id
    });

    const repositories = await api.listReposForApp();

    await Promise.all(repositories.map((repo) => RepositoryModel.upsert({
      provider_id: provider.id,
      slug: repo.slug,
      private: repo.private
    })));

    const installation = await InstallationModel.findByPk(installation_id);

    return res.status(200).json(installation);
  }
}

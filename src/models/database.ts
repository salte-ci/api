import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { AccountModel } from './account';
import { BotModel } from './bot';
import { BuildModel } from './build';
import { EnvironmentVariableModel } from './environment-variable';
import { LinkedAccountModel } from './linked-account';
import { ProviderModel } from './provider';
import { RunnerModel } from './runner';
import { RepoModel } from './repo';
import { UserModel } from './user';

const sequelize = new Sequelize(config.DATABASE_URL, {
  typeValidation: true,
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  logging: (...args) => logger.silly(...args)
});

sequelize.addModels([
  AccountModel,
  BotModel,
  BuildModel,
  EnvironmentVariableModel,
  LinkedAccountModel,
  ProviderModel,
  RunnerModel,
  RepoModel,
  UserModel
]);

let setup = false;
export async function database() {
  if (!setup) {
    await sequelize.sync();
    await sequelize.authenticate();

    for (const provider of config.DEFAULT_PROVIDERS) {
      await ProviderModel.upsert({
        name: provider.name,
        friendly_name: provider.friendly_name,
        type: provider.type,
        url: provider.url,
        api_url: provider.api_url,
        client_id: provider.client_id,
        client_secret: provider.client_secret
      });
    }

    setup = true;
  }

  return {
    sequelize,
    AccountModel,
    BotModel,
    BuildModel,
    EnvironmentVariableModel,
    LinkedAccountModel,
    ProviderModel,
    RunnerModel,
    RepoModel,
    UserModel
  };
}

import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';
import { CreateDatabase } from '../utils/sequelize';
import { Base64 } from '../utils/convert';

import { AccountModel } from './account';
import { BotModel } from './bot';
import { BuildModel } from './build';
import { EnvironmentVariableModel } from './environment-variable';
import { InstallationModel } from './installation';
import { LinkedAccountModel } from './linked-account';
import { ProviderModel } from './provider';
import { RunnerModel } from './runner';
import { OrganizationModel } from './organization';
import { RepositoryModel } from './repository';
import { UserModel } from './user';

const sequelize = new Sequelize(`${config.DATABASE_URL}/${config.DATABASE_NAME}`, {
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
  InstallationModel,
  LinkedAccountModel,
  ProviderModel,
  RunnerModel,
  OrganizationModel,
  RepositoryModel,
  UserModel
]);

let setup = false;
export async function database() {
  if (!setup) {
    await CreateDatabase(config.DATABASE_URL, config.DATABASE_NAME);
    await sequelize.sync();
    await sequelize.authenticate();

    for (const provider of config.DEFAULT_PROVIDERS) {
      await ProviderModel.upsert({
        app_id: provider.app_id,
        name: provider.name,
        friendly_name: provider.friendly_name,
        type: provider.type,
        url: provider.url,
        api_url: provider.api_url,
        client_id: provider.client_id,
        client_secret: provider.client_secret,
        private_key: Base64.decode(provider.private_key)
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
    InstallationModel,
    LinkedAccountModel,
    ProviderModel,
    RunnerModel,
    OrganizationModel,
    RepositoryModel,
    UserModel
  };
}

export {
  AccountModel,
  BotModel,
  BuildModel,
  EnvironmentVariableModel,
  InstallationModel,
  LinkedAccountModel,
  ProviderModel,
  RunnerModel,
  OrganizationModel,
  RepositoryModel,
  UserModel
};

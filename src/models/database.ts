import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { AccountModel } from './account';
import { BotModel } from './bot';
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
    setup = true;
    await sequelize.sync();
    await sequelize.authenticate();
  }

  if (config.DEFAULT_GITHUB_PROVIDER) {
    await ProviderModel.upsert({
      name: 'github',
      friendly_name: 'GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: config.DEFAULT_GITHUB_PROVIDER.CLIENT_ID,
      client_secret: config.DEFAULT_GITHUB_PROVIDER.CLIENT_SECRET
    });
  }

  if (config.DEFAULT_BITBUCKET_PROVIDER) {
    await ProviderModel.upsert({
      name: 'bitbucket',
      friendly_name: 'Bitbucket',
      type: 'bitbucket',
      url: 'https://bitbucket.org',
      api_url: 'https://api.bitbucket.org',
      client_id: config.DEFAULT_BITBUCKET_PROVIDER.CLIENT_ID,
      client_secret: config.DEFAULT_BITBUCKET_PROVIDER.CLIENT_SECRET
    });
  }

  if (config.DEFAULT_GITLAB_PROVIDER) {
    await ProviderModel.upsert({
      name: 'gitlab',
      friendly_name: 'GitLab',
      type: 'gitlab',
      url: 'https://gitlab.com',
      api_url: 'https://gitlab.com',
      client_id: config.DEFAULT_GITLAB_PROVIDER.CLIENT_ID,
      client_secret: config.DEFAULT_GITLAB_PROVIDER.CLIENT_SECRET
    });
  }

  return {
    sequelize,
    AccountModel,
    BotModel,
    EnvironmentVariableModel,
    LinkedAccountModel,
    ProviderModel,
    RunnerModel,
    RepoModel,
    UserModel
  };
}

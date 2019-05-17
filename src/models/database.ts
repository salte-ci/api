import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { AccountModel } from './account';
import { BotModel } from './bot';
import { EnvironmentVariableModel } from './environment-variable';
import { LinkModel } from './link';
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
  LinkModel,
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

  return {
    sequelize,
    AccountModel,
    BotModel,
    EnvironmentVariableModel,
    LinkModel,
    LinkedAccountModel,
    ProviderModel,
    RunnerModel,
    RepoModel,
    UserModel
  };
}

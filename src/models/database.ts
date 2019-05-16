import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { LinkModel } from './link';
import { ProviderModel } from './provider';
import { AccountModel } from './account';

const sequelize = new Sequelize(config.DATABASE_URL, {
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  logging: (...args) => logger.silly(...args)
});

sequelize.addModels([
  AccountModel,
  LinkModel,
  ProviderModel
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
    LinkModel,
    ProviderModel
  };
}

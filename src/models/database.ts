import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { LinkModel } from './link';

const sequelize = new Sequelize(config.DATABASE_URL, {
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  logging: (...args) => logger.silly(...args)
});

sequelize.addModels([LinkModel]);

let setup = false;
export async function database() {
  if (!setup) {
    setup = true;
    await sequelize.sync();
    await sequelize.authenticate();
  }

  return { sequelize, LinkModel };
}

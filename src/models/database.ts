import { Sequelize } from 'sequelize-typescript';
import { config } from '../shared/config';
import { logger } from '../shared/logger';

import { LinkModel } from './link';

const sequelize = new Sequelize(config.DATABASE_URL, {
  logging: (...args) => logger.silly(...args)
});

sequelize.addModels([LinkModel]);

(async () => {
  await sequelize.sync();
  await sequelize.authenticate();
})();

export { sequelize, LinkModel };

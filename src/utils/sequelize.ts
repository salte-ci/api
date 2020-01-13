import { Sequelize } from 'sequelize-typescript';
import { logger } from '../shared/logger';

export async function CreateDatabase(url: string, name: string) {
  const sequelize = new Sequelize(url);

  if (sequelize.options.dialect !== 'sqlite') {
    logger.info('Creating database...');
    try {
      await sequelize.query(`CREATE DATABASE \`${name}\`;`);
      logger.info('Database Created!');
    } catch (error) {
      if (error.message.includes('exists')) {
        logger.info('Database already exists!');
      } else {
        throw error;
      }
    }
  }

  await sequelize.close();
}

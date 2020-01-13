import { Sequelize } from 'sequelize-typescript';

export async function CreateDatabase(sequelize: Sequelize, name: string) {
  if (sequelize.options.dialect !== 'sqlite') {
    await sequelize.query(`CREATE DATABASE ${name}`);
  }
}

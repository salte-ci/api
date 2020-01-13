import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import * as Chance from 'chance';

export const chance = new Chance();

export function database(options?: SequelizeOptions) {
  return new Sequelize('sqlite://:memory', {
    dialect: 'sqlite',
    ...options
  });
}

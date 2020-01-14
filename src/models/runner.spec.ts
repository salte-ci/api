import { expect } from '@hapi/code';
import { database } from './database';
import { CreateRunner } from '../utils/test/mock';

describe('RunnerModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a runner', async () => {
    const runner = await CreateRunner();

    expect(runner.id).exists();
    expect(runner.updated_at).to.be.an.instanceOf(Date);
    expect(runner.created_at).to.be.an.instanceOf(Date);
  });
});

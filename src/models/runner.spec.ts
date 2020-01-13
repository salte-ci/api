import { expect } from '@hapi/code';
import { database } from './database';

describe('RunnerModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a runner', async () => {
    const { RunnerModel } = await database();

    const runner = await RunnerModel.create();

    expect(runner.id).to.equal(1);
    expect(runner.updated_at).to.be.an.instanceOf(Date);
    expect(runner.created_at).to.be.an.instanceOf(Date);
  });
});

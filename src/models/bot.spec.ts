import { expect } from 'chai';
import { database } from './database';

describe('BotModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a bot account', async () => {
    const { AccountModel, BotModel } = await database();

    const account = await AccountModel.create({
      id: '12345'
    });

    const bot = await BotModel.create({
      id: account.id,
      api_key: '54321'
    });

    expect(bot.id).to.equal('12345');
    expect(bot.api_key).to.equal('54321');
    expect(bot.updated_at).to.be.an.instanceOf(Date);
    expect(bot.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure that an account exists for a given bot user', async () => {
    const { BotModel } = await database();

    const error = await BotModel.create({
      id: '12345',
      api_key: '54321'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('Validation error');
  });
});

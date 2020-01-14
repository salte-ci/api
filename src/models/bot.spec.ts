import { expect } from '@hapi/code';
import { database } from './database';
import { chance, CreateAccount, CreateBot } from '../utils/test/mock';

describe('BotModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a bot account', async () => {
    const account = await CreateAccount();

    const bot = await CreateBot({
      id: account.id
    });

    expect(bot.id).to.equal(account.id);
    expect(bot.api_key).exists();
    expect(bot.updated_at).to.be.an.instanceOf(Date);
    expect(bot.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure that an account exists for a given bot user', async () => {
    const promise = CreateBot({
      id: chance.string(),
      api_key: '54321'
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

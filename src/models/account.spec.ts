import { expect } from '@hapi/code';
import { database } from './database';
import { CreateAccount } from '../utils/test/mock';

describe('AccountModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create an account', async () => {
    const account = await CreateAccount();

    expect(account.id).exists();
    expect(account.updated_at).to.be.an.instanceOf(Date);
    expect(account.created_at).to.be.an.instanceOf(Date);
  });
});

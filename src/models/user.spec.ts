import { expect } from '@hapi/code';
import { database } from './database';
import { CreateAccount, CreateUser } from '../utils/test/mock';

describe('UserModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a user account', async () => {
    const account = await CreateAccount();

    const user = await CreateUser({
      id: account.id
    });

    expect(user.id).to.equal(account.id);
    expect(user.updated_at).to.be.an.instanceOf(Date);
    expect(user.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure an account exists for a given user account', async () => {
    const promise = CreateUser({
      id: '12345'
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

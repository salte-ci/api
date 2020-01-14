import { expect } from '@hapi/code';
import { database } from './database';
import { CreateProvider, CreateAccount, CreateLinkedAccount, chance } from '../utils/test/mock';

describe('LinkedAccountModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should link an account to a provider', async () => {
    const account = await CreateAccount();

    const provider = await CreateProvider();

    const linkedAccount = await CreateLinkedAccount({
      account_id: account.id,
      provider_id: provider.id,
    });

    expect(linkedAccount.account_id).to.equal(account.id);
    expect(linkedAccount.provider_id).to.equal(provider.id);
    expect(linkedAccount.access_token).exists();
    expect(linkedAccount.updated_at).to.be.an.instanceOf(Date);
    expect(linkedAccount.created_at).to.be.an.instanceOf(Date);
  });

  it(`should throw an error if the account doesn't exist`, async () => {
    const provider = await CreateProvider();

    const promise = CreateLinkedAccount({
      account_id: chance.string(),
      provider_id: provider.id,
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });

  it(`should throw an error if the provider doesn't exist`, async () => {
    const account = await CreateAccount();

    const promise = CreateLinkedAccount({
      account_id: account.id,
      provider_id: chance.integer(),
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

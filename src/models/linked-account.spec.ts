import { expect } from '@hapi/code';
import { database } from './database';

describe('LinkedAccountModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should link an account to a provider', async () => {
    const { AccountModel, ProviderModel, LinkedAccountModel } = await database();

    const account = await AccountModel.create({
      id: '12345'
    });

    const provider = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: 'client_id',
      client_secret: 'client_secret'
    });

    const linkedAccount = await LinkedAccountModel.create({
      account_id: account.id,
      provider_id: provider.id,
      access_token: '54321'
    });

    expect(linkedAccount.account_id).to.equal('12345');
    expect(linkedAccount.provider_id).to.equal(1);
    expect(linkedAccount.access_token).to.equal('54321');
    expect(linkedAccount.updated_at).to.be.an.instanceOf(Date);
    expect(linkedAccount.created_at).to.be.an.instanceOf(Date);
  });

  it(`should throw an error if the account or provider don't exist`, async () => {
    const { LinkedAccountModel } = await database();

    const error = await LinkedAccountModel.create({
      account_id: 'bogus',
      provider_id: -1,
      access_token: '54321'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

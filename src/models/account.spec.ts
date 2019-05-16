import { expect } from 'chai';
import { database } from './database';

describe('AccountModel', () => {
  it('should create an account', async () => {
    const { AccountModel } = await database();

    const account = await AccountModel.create({
      id: 'hello'
    });

    expect(account.id).to.equal('hello');
    expect(account.updated_at).to.be.an.instanceOf(Date);
    expect(account.created_at).to.be.an.instanceOf(Date);
  });
});

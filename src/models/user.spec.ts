import { expect } from 'chai';
import { database } from './database';

describe('UserModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a user account', async () => {
    const { AccountModel, UserModel } = await database();

    const account = await AccountModel.create({
      id: '12345'
    });

    const user = await UserModel.create({
      id: account.id
    });

    expect(user.id).to.equal('12345');
    expect(user.updated_at).to.be.an.instanceOf(Date);
    expect(user.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure an account exists for a given user account', async () => {
    const { UserModel } = await database();

    const error = await UserModel.create({
      id: '12345'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

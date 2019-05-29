import { expect } from 'chai';
import { database } from './database';

describe('EnvironmentVariableModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create an environment variable', async () => {
    const { ProviderModel, EnvironmentVariableModel } = await database();

    const provider = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: 'client_id',
      client_secret: 'client_secret'
    });

    const environmentVariable = await EnvironmentVariableModel.create({
      provider_id: provider.id,
      scope: 'salte-ci/ui',
      key: 'AWS_ACCESS_KEY',
      masked: true,
      value: '12345'
    });

    expect(environmentVariable.provider_id).to.equal(1);
    expect(environmentVariable.scope).to.equal('salte-ci/ui');
    expect(environmentVariable.key).to.equal('AWS_ACCESS_KEY');
    expect(environmentVariable.masked).to.equal(true);
    expect(environmentVariable.value).to.equal('12345');
    expect(environmentVariable.updated_at).to.be.an.instanceOf(Date);
    expect(environmentVariable.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure a provider exists for a given environment variable', async () => {
    const { EnvironmentVariableModel } = await database();

    const error = await EnvironmentVariableModel.create({
      provider_id: 12345,
      scope: 'salte-ci/ui',
      key: 'AWS_ACCESS_KEY',
      masked: true,
      value: '12345'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

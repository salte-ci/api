import { expect } from '@hapi/code';
import { database } from './database';
import { CreateProvider, CreateEnvironmentVariable } from '../utils/test/mock';

describe('EnvironmentVariableModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create an environment variable', async () => {
    const provider = await CreateProvider();

    const environmentVariable = await CreateEnvironmentVariable({
      provider_id: provider.id,
    });

    expect(environmentVariable.provider_id).to.equal(provider.id);
    expect(environmentVariable.scope).exists();
    expect(environmentVariable.key).exists();
    expect(environmentVariable.masked).exists();
    expect(environmentVariable.value).exists();
    expect(environmentVariable.updated_at).to.be.an.instanceOf(Date);
    expect(environmentVariable.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure a provider exists for a given environment variable', async () => {
    const promise = CreateEnvironmentVariable({
      provider_id: 12345,
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

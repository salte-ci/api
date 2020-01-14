import { expect } from '@hapi/code';
import { database } from './database';
import { CreateProvider, CreateRepo } from '../utils/test/mock';

describe('RepoModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a repo', async () => {
    const provider = await CreateProvider();

    const repo = await CreateRepo({
      provider_id: provider.id,
    });

    expect(repo.id).exists();
    expect(repo.provider_id).to.equal(provider.id);
    expect(repo.slug).exists();
    expect(repo.updated_at).to.be.an.instanceOf(Date);
    expect(repo.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure a provider exists for a given repo', async () => {
    const promise = CreateRepo({
      provider_id: '12345',
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

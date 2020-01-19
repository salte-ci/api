import { expect } from '@hapi/code';
import { database } from './database';
import { chance, CreateProvider, CreateOrganization, CreateRepository } from '../utils/test/mock';

describe('RepositoryModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a repo', async () => {
    const provider = await CreateProvider();

    const organization = await CreateOrganization({
      provider_id: provider.id,
    });

    const repo = await CreateRepository({
      provider_id: provider.id,
      organization_id: organization.id,
    });

    expect(repo.id).exists();
    expect(repo.provider_id).to.equal(provider.id);
    expect(repo.slug).exists();
    expect(repo.updated_at).to.be.an.instanceOf(Date);
    expect(repo.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure a provider exists for a given repo', async () => {
    const provider = await CreateProvider();

    const organization = await CreateOrganization({
      provider_id: provider.id
    });

    const promise = CreateRepository({
      provider_id: chance.integer(),
      organization_id: organization.id,
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });

  it('should ensure a organization exists for a given repo', async () => {
    const provider = await CreateProvider();

    const promise = CreateRepository({
      provider_id: provider.id,
      organization_id: chance.integer(),
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

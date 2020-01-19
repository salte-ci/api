import { expect } from '@hapi/code';
import { database } from './database';
import { CreateProvider, CreateRepository, CreateBuild, CreateOrganization } from '../utils/test/mock';

describe('BuildModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a build', async () => {
    const provider = await CreateProvider();
    const organization = await CreateOrganization({
      provider_id: provider.id,
    });

    const repo = await CreateRepository({
      provider_id: provider.id,
      organization_id: organization.id,
    });

    const build = await CreateBuild({
      repository_id: repo.id
    });

    expect(build.id).to.equal(1);
    expect(build.repository_id).to.equal(repo.id);
    expect(build.updated_at).to.be.an.instanceOf(Date);
    expect(build.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure that a repo exists for a given build', async () => {
    const promise = CreateBuild({
      repository_id: 12435
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

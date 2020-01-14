import { expect } from '@hapi/code';
import { database } from './database';
import { CreateProvider, CreateRepo, CreateBuild } from '../utils/test/mock';

describe('BuildModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a build', async () => {
    const provider = await CreateProvider();

    const repo = await CreateRepo({
      provider_id: provider.id,
    });

    const build = await CreateBuild({
      repo_id: repo.id
    });

    expect(build.id).to.equal(1);
    expect(build.repo_id).to.equal(repo.id);
    expect(build.updated_at).to.be.an.instanceOf(Date);
    expect(build.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure that a repo exists for a given build', async () => {
    const promise = CreateBuild({
      repo_id: 12435
    });

    await expect(promise).rejects(Error, 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

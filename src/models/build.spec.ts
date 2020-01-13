import { expect } from '@hapi/code';
import { database } from './database';

describe('BuildModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a build', async () => {
    const { ProviderModel, RepoModel, BuildModel } = await database();

    const provider = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: 'client_id',
      client_secret: 'client_secret'
    });

    const repo = await RepoModel.create({
      provider_id: provider.id,
      slug: 'salte-ci/ui',
      private: false
    });

    const build = await BuildModel.create({
      repo_id: repo.id
    });

    expect(build.id).to.equal(1);
    expect(build.repo_id).to.equal(repo.id);
    expect(build.updated_at).to.be.an.instanceOf(Date);
    expect(build.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure that a repo exists for a given build', async () => {
    const { BuildModel } = await database();

    const error = await BuildModel.create({
      repo_id: 12435
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

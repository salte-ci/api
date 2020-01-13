import { expect } from '@hapi/code';
import { database } from './database';

describe('RepoModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a repo', async () => {
    const { ProviderModel, RepoModel } = await database();

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

    expect(repo.id).to.equal(1);
    expect(repo.provider_id).to.equal(1);
    expect(repo.slug).to.equal('salte-ci/ui');
    expect(repo.updated_at).to.be.an.instanceOf(Date);
    expect(repo.created_at).to.be.an.instanceOf(Date);
  });

  it('should ensure a provider exists for a given repo', async () => {
    const { RepoModel } = await database();

    const error = await RepoModel.create({
      provider_id: '12345',
      slug: 'salte-ci/ui',
      private: false
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
  });
});

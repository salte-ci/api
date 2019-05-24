import { expect } from 'chai';
import { outdent } from 'outdent';
import { database } from './database';

describe('ProviderModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a provider', async () => {
    const { ProviderModel } = await database();

    const provider = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: '12345',
      client_secret: '54321'
    });

    expect(provider.id).to.equal(1);
    expect(provider.name).to.equal('enterprise-github');
    expect(provider.friendly_name).to.equal('Enterprise GitHub');
    expect(provider.type).to.equal('github');
    expect(provider.client_id).to.equal('12345');
    expect(provider.client_secret).to.equal('54321');
    expect(provider.updated_at).to.be.an.instanceOf(Date);
    expect(provider.created_at).to.be.an.instanceOf(Date);
  });

  it('should throw an error if a name, friendly_name, or type are not provided', async () => {
    const { ProviderModel } = await database();

    const error = await ProviderModel.create().catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal(outdent`
      notNull Violation: provider.client_id cannot be null,
      notNull Violation: provider.client_secret cannot be null,
      notNull Violation: provider.name cannot be null,
      notNull Violation: provider.friendly_name cannot be null,
      notNull Violation: provider.type cannot be null,
      notNull Violation: provider.url cannot be null,
      notNull Violation: provider.api_url cannot be null
    `);
  });

  it('should throw an error if type is not "bitbucket", "github", or "gitlab"', async () => {
    const { ProviderModel } = await database();

    const error = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'my-custom-git-provider',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: '12345',
      client_secret: '54321'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('"my-custom-git-provider" is not a valid choice in ["bitbucket","github","gitlab"]');
  });
});

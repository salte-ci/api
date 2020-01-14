import { expect } from '@hapi/code';
import { outdent } from 'outdent';
import { database } from './database';
import { CreateProvider } from '../utils/test/mock';

describe('ProviderModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create a provider', async () => {
    const provider = await CreateProvider();

    expect(provider.id).exists();
    expect(provider.name).exists();
    expect(provider.friendly_name).exists();
    expect(provider.type).exists();
    expect(provider.client_id).exists();
    expect(provider.client_secret).exists();
    expect(provider.updated_at).to.be.an.instanceOf(Date);
    expect(provider.created_at).to.be.an.instanceOf(Date);
  });

  it('should throw an error if a client_id, client_secret, name, friendly_name, type, url, or api_url are not provided', async () => {
    const { ProviderModel } = await database();
    const promise = ProviderModel.create();

    await expect(promise).rejects(Error, outdent`
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
    const promise = CreateProvider({
      type: 'my-custom-git-provider',
    });

    await expect(promise).rejects(Error, '"my-custom-git-provider" is not a valid choice in ["bitbucket","github","gitlab"]');
  });
});

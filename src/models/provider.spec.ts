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
      name: 'github',
      friendly_name: 'GitHub',
      type: 'github'
    });

    expect(provider.id).to.equal(1);
    expect(provider.name).to.equal('github');
    expect(provider.friendly_name).to.equal('GitHub');
    expect(provider.type).to.equal('github');
    expect(provider.updated_at).to.be.an.instanceOf(Date);
    expect(provider.created_at).to.be.an.instanceOf(Date);
  });

  it('should throw an error if a name, friendly_name, or type are not provided', async () => {
    const { ProviderModel } = await database();

    const error = await ProviderModel.create().catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal(outdent`
      notNull Violation: provider.name cannot be null,
      notNull Violation: provider.friendly_name cannot be null,
      notNull Violation: provider.type cannot be null
    `);
  });

  it('should throw an error if type is not "bitbucket", "github", or "gitlab"', async () => {
    const { ProviderModel } = await database();

    const error = await ProviderModel.create({
      name: 'github',
      friendly_name: 'GitHub',
      type: 'my-custom-git-provider'
    }).catch((error: Error) => error);

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal('"my-custom-git-provider" is not a valid choice in ["bitbucket","github","gitlab"]');
  });
});

import { expect } from '@hapi/code';
import { database } from './database';
import { CreateOrganization, CreateProvider } from '../utils/test/mock';

describe('OrganizationModel', () => {
  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  it('should create an organization', async () => {
    const provider = await CreateProvider();

    const organization = await CreateOrganization({
      provider_id: provider.id,
    });

    expect(organization.id).exists();
    expect(organization.provider_id).equals(provider.id);
  });
});

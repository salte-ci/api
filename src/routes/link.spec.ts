import * as sinon from 'sinon';
import { expect } from 'chai';

import { database } from '../models/database';
import { GitHubProvider } from '../providers/github';
import { LinkRoute } from './link';

describe('LinkRoute', () => {
  const linkRoute = new LinkRoute();
  let account: any;
  let provider: any;

  beforeEach(async () => {
    const { AccountModel, ProviderModel, sequelize } = await database();
    await sequelize.sync({ force: true });

    account = await AccountModel.create({
      id: '12345'
    });

    provider = await ProviderModel.create({
      name: 'enterprise-github',
      friendly_name: 'Enterprise GitHub',
      type: 'github',
      url: 'https://github.com',
      api_url: 'https://api.github.com',
      client_id: '12345',
      client_secret: '54321'
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('function(get)', () => {
    let linkedAccount: any;
    beforeEach(async () => {
      const { LinkedAccountModel } = await database();
      linkedAccount = await LinkedAccountModel.create({
        account_id: account.id,
        provider_id: provider.id,
        access_token: '54321'
      });
    });

    it(`should get a list of all the linked accounts`, async () => {
      const links = await linkRoute.get({
        auth: {
          sub: '12345'
        },
        params: {}
      } as any);

      expect(links.map((link: any) => link.dataValues)).to.deep.equal([{
        account_id: account.id,
        provider_id: provider.id,
        access_token: '54321',
        refresh_token: null,
        created_at: linkedAccount.created_at,
        updated_at: linkedAccount.updated_at
      }]);
    });

    it(`should support gettings a specific linked account`, async () => {
      const link = await linkRoute.get({
        auth: {
          sub: '12345'
        },
        params: {
          id: provider.id
        }
      } as any);

      expect(link.dataValues).to.deep.equal({
        account_id: account.id,
        provider_id: provider.id,
        access_token: '54321',
        refresh_token: null,
        created_at: linkedAccount.created_at,
        updated_at: linkedAccount.updated_at
      });
    });
  });

  describe('function(post)', () => {
    it(`should validate the users token`, async () => {
      sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      sinon.stub(GitHubProvider.prototype, 'validate');

      const link = await linkRoute.post({
        auth: {
          sub: '12345'
        },
        params: {
          id: provider.id
        },
        body: {
          code: 'code'
        }
      } as any);

      expect(link.account_id).to.equal(account.id);
      expect(link.provider_id).to.equal(provider.id);
      expect(link.access_token).to.equal('access');
      expect(link.refresh_token).to.equal(null);
      expect(GitHubProvider.token).to.have.callCount(1);
      expect(GitHubProvider.prototype.validate).to.have.callCount(1);
    });

    it(`should throw an error if the token is invalid`, async () => {
      sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const error = await linkRoute.post({
        auth: {
          sub: '12345'
        },
        params: {
          id: provider.id
        },
        body: {
          code: 'code'
        }
      } as any).catch((error) => error);

      expect(error.code).to.equal('invalid_token');
      expect(error.status).to.equal(400);
      expect(error.message).to.equal(`Invalid token provided for the given provider. (enterprise-github)`);
      expect(GitHubProvider.token).to.have.callCount(1);
      expect(GitHubProvider.prototype.validate).to.have.callCount(1);
    });

    it(`should throw an error a provider isn't given`, async () => {
      sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const error = await linkRoute.post({
        auth: {
          sub: '12345'
        },
        params: {},
        body: {
          code: 'code'
        }
      } as any).catch((error) => error);

      expect(error.code).to.equal('not_found');
      expect(error.status).to.equal(404);
      expect(error.message).to.equal(`No provider exists for the given id. (undefined)`);
      expect(GitHubProvider.token).to.have.callCount(0);
      expect(GitHubProvider.prototype.validate).to.have.callCount(0);
    });

    it(`should throw an error a user isn't authorized`, async () => {
      sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const error = await linkRoute.post({
        params: {},
        body: {
          code: 'code'
        }
      } as any).catch((error) => error);

      expect(error.code).to.equal('unauthorized');
      expect(error.status).to.equal(401);
      expect(error.message).to.equal(`Must be authenticated to link new accounts.`);
      expect(GitHubProvider.token).to.have.callCount(0);
      expect(GitHubProvider.prototype.validate).to.have.callCount(0);
    });
  });
});

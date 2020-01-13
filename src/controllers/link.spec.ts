import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as request from 'supertest';

import { database } from '../models/database';
import { GitHubProvider } from '../providers/github';
import * as Auth from '../utils/auth';
import { ExpressServer } from '../server';

describe('LinkController', () => {
  const { server } = new ExpressServer();
  let account: any;
  let provider: any;

  beforeEach(async () => {
    sinon.stub(Auth, 'auth').resolves({
      sub: '12345'
    });

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
      client_id: 'client_id',
      client_secret: 'client_secret'
    });
  });

  afterEach(() => {
    sinon.restore();
    server.close();
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
      const response = await request(server).get('/links');

      expect(response.body).equals([{
        account_id: account.id,
        provider_id: provider.id,
        access_token: '54321',
        refresh_token: null,
        created_at: linkedAccount.created_at.toISOString(),
        updated_at: linkedAccount.updated_at.toISOString()
      }]);
    });

    it(`should support getting a specific linked account`, async () => {
      const response = await request(server).get(`/links/${provider.name}`);

      expect(response.body).equals({
        account_id: account.id,
        provider_id: provider.id,
        access_token: '54321',
        refresh_token: null,
        created_at: linkedAccount.created_at.toISOString(),
        updated_at: linkedAccount.updated_at.toISOString()
      });
    });

    it(`should throw an error if a link isn't found`, async () => {
      const { body } = await request(server).get('/links/unknown');

      expect(body).equals({
        code: 'not_found',
        message: 'Unable to find link for the given provider. (unknown)',
        status: 404
      });
    });

    it(`should require authentication to view linked accounts`, async () => {
      (Auth.auth as any).restore();
      const { body } = await request(server).get(`/links/${provider.name}`);

      expect(body).equals({
        code: 'unauthorized',
        message: 'Must be authenticated to view linked accounts.',
        status: 401
      });
    });
  });

  describe('function(post)', () => {
    it(`should validate the users token`, async () => {
      const token = sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(GitHubProvider.prototype, 'validate');

      const { body } = await request(server).post(`/links/${provider.name}`).send({
        code: 'code'
      });

      expect(body.account_id).to.equal(account.id);
      expect(body.provider_id).to.equal(provider.id);
      expect(body.access_token).to.equal('access');
      expect(body.refresh_token).to.equal(null);

      sinon.assert.calledOnce(token);
      sinon.assert.calledOnce(validate);
    });

    it(`should throw an error if the token is invalid`, async () => {
      const token = sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const { body } = await request(server).post(`/links/${provider.name}`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'invalid_token',
        message: 'Invalid token provided for the given provider. (enterprise-github)',
        status: 400
      });

      sinon.assert.calledOnce(token);
      sinon.assert.calledOnce(validate);
    });

    it(`should throw an error a provider isn't given`, async () => {
      const token = sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const { body } = await request(server).post(`/links`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'invalid_provider_name',
        message: 'The name of a provider must be given. (undefined)',
        status: 400
      });

      sinon.assert.notCalled(token);
      sinon.assert.notCalled(validate);
    });

    it(`should throw an error a user isn't authorized`, async () => {
      (Auth.auth as any).restore();
      const token = sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const { body } = await request(server).post(`/links`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'unauthorized',
        message: 'Must be authenticated to link new accounts.',
        status: 401
      });

      sinon.assert.notCalled(token);
      sinon.assert.notCalled(validate);
    });

    it(`should throw an error a provider doesn't exist`, async () => {
      const token = sinon.stub(GitHubProvider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(GitHubProvider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const { body } = await request(server).post(`/links/unknown`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'not_found',
        message: `No provider exists for the given name. (unknown)`,
        status: 404
      });

      sinon.assert.notCalled(token);
      sinon.assert.notCalled(validate);
    });
  });
});

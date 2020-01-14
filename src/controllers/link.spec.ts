import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as request from 'supertest';

import { database } from '../models/database';
import { providers } from '../providers';
import * as Auth from '../utils/auth';
import { ExpressServer } from '../server';
import { CreateAccount, CreateProvider, CreateLinkedAccount } from '../utils/test/mock';

describe('LinkController', () => {
  const { server } = new ExpressServer();
  let account: any;
  let provider: any;

  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });

    account = await CreateAccount();

    provider = await CreateProvider();

    sinon.stub(Auth, 'auth').resolves({
      sub: account.id
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    server.close();
  });

  describe('function(get)', () => {
    let linkedAccount: any;
    beforeEach(async () => {
      linkedAccount = await CreateLinkedAccount({
        account_id: account.id,
        provider_id: provider.id
      });
    });

    it(`should get a list of all the linked accounts`, async () => {
      const response = await request(server).get('/links');

      expect(response.body).equals([{
        account_id: account.id,
        provider_id: provider.id,
        access_token: linkedAccount.access_token,
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
        access_token: linkedAccount.access_token,
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
      const Provider = providers(provider.type);
      const token = sinon.stub(Provider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(Provider.prototype, 'validate');

      const { body, status } = await request(server).post(`/links/${provider.name}`).send({
        code: 'code'
      });

      expect(status).equals(200);
      expect(body.account_id).equals(account.id);
      expect(body.provider_id).equals(provider.id);
      expect(body.access_token).equals('access');
      expect(body.refresh_token).equals(null);

      sinon.assert.calledOnce(token);
      sinon.assert.calledOnce(validate);
    });

    it(`should throw an error if the token is invalid`, async () => {
      const Provider = providers(provider.type);
      const token = sinon.stub(Provider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(Provider.prototype, 'validate').callsFake(() => {
        throw new Error('Whoops');
      });

      const { body } = await request(server).post(`/links/${provider.name}`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'invalid_token',
        message: `Invalid token provided for the given provider. (${provider.name})`,
        status: 400
      });

      sinon.assert.calledOnce(token);
      sinon.assert.calledOnce(validate);
    });

    it(`should throw an error a provider isn't given`, async () => {
      const Provider = providers(provider.type);
      const token = sinon.stub(Provider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(Provider.prototype, 'validate');

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
      const Provider = providers(provider.type);
      const token = sinon.stub(Provider, 'token').resolves({
        access_token: 'access'
      });
      const validate = sinon.stub(Provider.prototype, 'validate');

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
      const { body } = await request(server).post(`/links/unknown`).send({
        code: 'code'
      });

      expect(body).equals({
        code: 'not_found',
        message: `No provider exists for the given name. (unknown)`,
        status: 404
      });
    });
  });
});

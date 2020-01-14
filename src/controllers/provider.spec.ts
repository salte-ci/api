import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as request from 'supertest';

import { database } from '../models/database';
import * as Auth from '../utils/auth';
import { ExpressServer } from '../server';
import { CreateProvider } from '../utils/test/mock';

describe('ProviderController', () => {
  const { server } = new ExpressServer();
  let provider: any;

  beforeEach(async () => {
    const { sequelize } = await database();
    await sequelize.sync({ force: true });

    provider = await CreateProvider();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    server.close();
  });

  describe('function(get)', () => {
    it(`should return a list of all the providers`, async () => {
      sinon.stub(Auth, 'auth').resolves({
        sub: '12345',
        'http://salte.io/groups': ['salte-ci-admin']
      });

      const { body } = await request(server).get('/providers');

      expect(body).equals([{
        id: provider.id,
        name: provider.name,
        friendly_name: provider.friendly_name,
        type: provider.type,
        url: provider.url,
        api_url: provider.api_url,
        client_id: provider.client_id,
        client_secret: provider.client_secret,
        created_at: provider.created_at.toISOString(),
        updated_at: provider.updated_at.toISOString()
      }]);
    });

    it(`should throw an error if the user isn't an admin`, async () => {
      sinon.stub(Auth, 'auth').resolves({
        sub: '12345',
        'http://salte.io/groups': []
      });

      const { body } = await request(server).get('/providers');

      expect(body).equals({
        code: 'unauthorized',
        message: `This endpoint is restricted to administrators.`,
        status: 401
      });
    });

    it(`should throw an error if the user isn't authenticated`, async () => {
      const { body } = await request(server).get('/providers');

      expect(body).equals({
        code: 'unauthorized',
        message: `Must be authenticated to view the active providers.`,
        status: 401
      });
    });
  });
});

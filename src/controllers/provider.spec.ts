import * as sinon from 'sinon';
import * as chai from 'chai';
import * as request from 'supertest';
import * as sinonChai from 'sinon-chai';

import { database } from '../models/database';
import * as Auth from '../utils/auth';
import { ExpressServer } from '../server';

chai.use(sinonChai);
const { expect } = chai;

describe('ProviderController', () => {
  const { server } = new ExpressServer();
  let provider: any;

  beforeEach(async () => {
    const { ProviderModel, sequelize } = await database();
    await sequelize.sync({ force: true });

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
    server.close();
  });

  describe('function(get)', () => {
    it(`should return a list of all the providers`, async () => {
      sinon.stub(Auth, 'auth').resolves({
        sub: '12345',
        'http://salte.io/groups': ['salte-ci-admin']
      });

      const { body } = await request(server).get('/providers');

      expect(body).to.deep.equal([{
        id: provider.id,
        name: 'enterprise-github',
        friendly_name: 'Enterprise GitHub',
        type: 'github',
        url: 'https://github.com',
        api_url: 'https://api.github.com',
        client_id: '12345',
        client_secret: '54321',
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

      expect(body).to.deep.equal({
        code: 'unauthorized',
        message: `This endpoint is restricted to administrators.`,
        status: 401
      });
    });

    it(`should throw an error if the user isn't authenticated`, async () => {
      const { body } = await request(server).get('/providers');

      expect(body).to.deep.equal({
        code: 'unauthorized',
        message: `Must be authenticated to view the active providers.`,
        status: 401
      });
    });
  });
});

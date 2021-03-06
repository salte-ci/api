import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as request from 'supertest';

import { ExpressServer } from '../server';

describe('HealthController', () => {
  const { server } = new ExpressServer();

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    server.close();
  });

  describe('function(get)', () => {
    it(`should send back ok`, async () => {
      const { body } = await request(server).get('/health');

      expect(body).equals({
        status: 'ok'
      });
    });
  });
});

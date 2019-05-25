import * as sinon from 'sinon';
import { expect } from 'chai';
import * as request from 'supertest';

import { ExpressServer } from '../server';

describe('HealthController', () => {
  const { server } = new ExpressServer();

  afterEach(() => {
    sinon.restore();
    server.close();
  });

  describe('function(get)', () => {
    it(`should send back ok`, async () => {
      const { body } = await request(server).get('/health');

      expect(body).to.deep.equal({
        status: 'ok'
      });
    });
  });
});

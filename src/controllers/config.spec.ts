import { expect } from '@hapi/code';
import * as sinon from 'sinon';
import * as request from 'supertest';

import { ExpressServer } from '../server';
import { PUBLIC_CONFIG_ITEMS } from '../shared/config';

describe('Controller(Config)', () => {
  const { server } = new ExpressServer();

  afterEach(() => {
    sinon.restore();
    server.close();
  });

  describe('function(get)', () => {
    it(`should send back the public config items`, async () => {
      const { body } = await request(server).get('/config');

      expect(Object.keys(body)).equals(PUBLIC_CONFIG_ITEMS);
    });
  });
});

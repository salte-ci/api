import { expect } from '@hapi/code';
import * as sinon from 'sinon';

import { env } from './config';
import { chance } from '../utils/test/mock';

describe('Config', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('function(env)', () => {
    it(`should return null if the value doesn't exist`, async () => {
      const name = chance.string().toUpperCase();
      const value = chance.string();

      sinon.stub(process, 'env').get(() => ({
        [name]: value
      }));

      expect(env(name)).equals(value);
    });

    it(`should support parsing json`, async () => {
      const name = chance.string().toUpperCase();
      const value = [chance.string()]

      sinon.stub(process, 'env').get(() => ({
        [name]: JSON.stringify(value)
      }));

      expect(env(name)).equals(value);
    });

    it(`should return null if the value doesn't exist`, async () => {
      expect(env(chance.string())).equals(null);
    });

    it(`should fallback to the default value`, async () => {
      const value = chance.string();

      expect(env(chance.string(), value)).equals(value);
    });
  });
});

import { expect } from 'chai';
import { fetch } from './fetch';

describe('Fetch', () => {
  describe('function(fetch)', () => {
    it('should support successful responses', async () => {
      const response = await fetch('https://google.com');

      expect(response).to.be.ok;
    });

    it('should support errors', async () => {
      const error = await fetch('http://localhost').catch((error) => error);

      expect(error.message).to.equal('request to http://localhost/ failed, reason: connect ECONNREFUSED 127.0.0.1:80');
    }).timeout(5000);
  });
});

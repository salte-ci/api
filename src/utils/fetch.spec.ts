import { expect } from '@hapi/code';
import { fetch } from './fetch';

describe('Fetch', () => {
  describe('function(fetch)', () => {
    it('should support successful responses', async () => {
      const response = await fetch('https://google.com');

      expect(response).exists();
    });

    it('should support errors', async () => {
      await expect(fetch('http://localhost')).rejects(Error, 'request to http://localhost/ failed, reason: connect ECONNREFUSED 127.0.0.1:80');
    }).timeout(5000);
  });
});

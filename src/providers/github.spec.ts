import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as nock from 'nock';

import { GitHubProvider } from './github';

describe('GitHubProvider', () => {
  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });

  describe('function(token)', () => {
    it('should provide an access_token', async () => {
      nock('https://github.com')
        .post('/login/oauth/access_token', {
          client_id: 'id',
          client_secret: 'secret',
          code: 'code'
        })
        .reply(200, {
          access_token: 'access',
          refresh_token: 'refresh'
        });

      const response = await GitHubProvider.token({
        client_id: 'id',
        client_secret: 'secret',
        code: 'code',
        url: 'https://github.com'
      });

      expect(response).equals({
        access_token: 'access'
      });
    });
  });

  describe('function(validate)', () => {
    it('should ensure the users token is valid', async () => {
      const provider = new GitHubProvider('https://api.github.com', '12345');

      const getAuthenticated = sinon.stub(provider.octokit.users, 'getAuthenticated').resolves();

      await provider.validate();

      sinon.assert.calledOnce(getAuthenticated);
    });

    it('should support errors', async () => {
      const provider = new GitHubProvider('https://api.github.com', '12345');

      sinon.stub(provider.octokit.users, 'getAuthenticated').returns(Promise.reject('Whoops!'));

      const error = await provider.validate().catch((error) => error);

      expect(error).to.equal('Whoops!');
    });
  });
});

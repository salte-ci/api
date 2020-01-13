import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as nock from 'nock';

import { config } from '../shared/config';
import { GitLabProvider } from './gitlab';

describe('GitLabProvider', () => {
  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });

  describe('function(token)', () => {
    it('should provide an access_token', async () => {
      nock('https://gitlab.com')
        .post('/oauth/token', {
          client_id: 'id',
          client_secret: 'secret',
          code: 'code',
          grant_type: 'authorization_code',
          redirect_uri: config.PROVIDER_REDIRECT_URI
        })
        .reply(200, {
          access_token: 'access',
          refresh_token: 'refresh'
        });

      const response = await GitLabProvider.token({
        client_id: 'id',
        client_secret: 'secret',
        code: 'code',
        url: 'https://gitlab.com'
      });

      expect(response).equals({
        access_token: 'access',
        refresh_token: 'refresh'
      });
    });
  });

  describe('function(validate)', () => {
    it('should ensure the users token is valid', async () => {
      const provider = new GitLabProvider('https://api.github.com', '12345');

      const current = sinon.stub(provider.gitlab.Users, 'current').resolves();

      await provider.validate();

      sinon.assert.calledOnce(current);
    });

    it('should support errors', async () => {
      const provider = new GitLabProvider('https://api.github.com', '12345');

      sinon.stub(provider.gitlab.Users, 'current').returns(Promise.reject('Whoops!'));

      const error = await provider.validate().catch((error) => error);

      expect(error).to.equal('Whoops!');
    });
  });
});

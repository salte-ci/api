import * as sinon from 'sinon';
import { expect } from '@hapi/code';
import * as nock from 'nock';

import { BitbucketProvider } from './bitbucket';

describe('BitbucketProvider', () => {
  afterEach(() => {
    sinon.restore();
    nock.cleanAll();
  });

  describe('function(token)', () => {
    it('should provide an access_token', async () => {
      nock('https://bitbucket.com')
        .post('/site/oauth2/access_token')
        .matchHeader('Authorization', 'Basic aWQ6c2VjcmV0')
        .reply(200, {
          access_token: 'access',
          refresh_token: 'refresh'
        });

      const response = await BitbucketProvider.token({
        client_id: 'id',
        client_secret: 'secret',
        code: 'code',
        url: 'https://bitbucket.com'
      });

      expect(response).equals({
        access_token: 'access',
        refresh_token: 'refresh'
      });
    });
  });

  describe('function(validate)', () => {
    it('should ensure the users token is valid', async () => {
      const provider = new BitbucketProvider('https://api.bitbucket.org', '12345');

      const getAuthedUser = sinon.stub(provider.bitbucket.users, 'getAuthedUser').resolves();

      await provider.validate();

      sinon.assert.calledOnce(getAuthedUser);
    });

    it('should support errors', async () => {
      const provider = new BitbucketProvider('https://api.bitbucket.org', '12345');

      sinon.stub(provider.bitbucket.users, 'getAuthedUser').returns(Promise.reject('Whoops!'));

      const error = await provider.validate().catch((error) => error);

      expect(error).to.equal('Whoops!');
    });
  });
});

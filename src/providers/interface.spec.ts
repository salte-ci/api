import { expect } from 'chai';

import { Provider } from './interface';

describe('Provider', () => {
  describe('function(token)', () => {
    it(`should throw an error if token isn't implemented`, async () => {
      const error = await Provider.token({
        client_id: 'id',
        client_secret: 'secret',
        code: 'code',
        url: 'https://salte.io'
      }).catch((error) => error);

      expect(error.message).to.equal('Method not implemented.');
    });
  });
});

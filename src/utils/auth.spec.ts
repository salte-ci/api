import { expect } from '@hapi/code';
import * as sinon from 'sinon';
import * as jwt from 'jsonwebtoken';
import * as fetch from './fetch';
import { auth } from './auth';
import { Base64 } from './convert';
import { database } from '../models/database';

describe('Auth', () => {
  beforeEach(async () => {
    sinon.stub(fetch, 'fetch').resolves({
      sub: '1234567890',
      name: 'John Doe',
      exp: 1524168810
    });
    const { sequelize } = await database();
    await sequelize.sync({ force: true });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('function(auth)', () => {
    beforeEach(async () => {
      sinon.stub(jwt, 'verify').callsFake((token, secretOrPublicKey, options, callback) => {
        if (!token) throw new Error(`Expected a token to be provided.`);
        if (typeof(secretOrPublicKey) !== 'function') throw new Error(`Expected Secret or Public Key to be a Function`);
        if (!callback) throw new Error(`Expected callback to be provided.`);

        const [header] = token.split('.');

        secretOrPublicKey({
          kid: JSON.parse(Base64.decode(header)).kid
        } as any, () => callback(null as any, {
          sub: '1234567890',
          name: 'John Doe',
          exp: 1524168810
        }));
      });
    });

    it('should parse valid tokens', async () => {
      const { AccountModel, UserModel } = await database();

      const accountCreate = sinon.spy(AccountModel, 'create');
      const userCreate = sinon.spy(UserModel, 'create');

      const accessToken = `${Base64.encode(JSON.stringify({
        kid: 'MTFDREZEMjk3RkU0MzgyMThBNjczQzBERjdGRTc0MjI0MEE5MkI0OA'
      }))}.${Base64.encode(JSON.stringify({
        sub: '1234567890',
        name: 'John Doe',
        exp: 1524168810
      }))}.12345`;

      const token = await auth({
        header: sinon.stub().returns(`Bearer ${accessToken}`)
      } as any);

      expect(token).equals({
        sub: '1234567890',
        name: 'John Doe',
        exp: 1524168810,
        token: accessToken
      });

      sinon.assert.calledOnce(accountCreate);
      sinon.assert.calledOnce(userCreate);
    });

    it('should support multiple requests', async () => {
      const { AccountModel, UserModel } = await database();

      const accountCreate = sinon.spy(AccountModel, 'create');
      const userCreate = sinon.spy(UserModel, 'create');

      await auth({
        header: sinon.stub().returns(`Bearer ${Base64.encode(JSON.stringify({
          kid: 'MTFDREZEMjk3RkU0MzgyMThBNjczQzBERjdGRTc0MjI0MEE5MkI0OA'
        }))}.${Base64.encode(JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: 1524168810
        }))}.12345`)
      } as any);

      sinon.assert.calledOnce(accountCreate);
      sinon.assert.calledOnce(userCreate);

      await auth({
        header: sinon.stub().returns(`Bearer ${Base64.encode(JSON.stringify({
          kid: 'MTFDREZEMjk3RkU0MzgyMThBNjczQzBERjdGRTc0MjI0MEE5MkI0OA'
        }))}.${Base64.encode(JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: 1524168810
        }))}.12345`)
      } as any);

      sinon.assert.calledOnce(accountCreate);
      sinon.assert.calledOnce(userCreate);
    });

    it('should throw an error for tokens without a kid', async () => {
      const { AccountModel, UserModel } = await database();

      const accountCreate = sinon.spy(AccountModel, 'create');
      const userCreate = sinon.spy(UserModel, 'create');

      const error = await auth({
        header: sinon.stub().returns(`Bearer ${Base64.encode(JSON.stringify({
          kid: null
        }))}.${Base64.encode(JSON.stringify({
          sub: '1234567890',
          name: 'John Doe',
          exp: 1524168810
        }))}.12345`)
      } as any).catch((error) => error);;

      expect(error.message).to.equal('Invalid kid in token.');

      sinon.assert.notCalled(accountCreate);
      sinon.assert.notCalled(userCreate);
    });

    it('should throw an error for malformed tokens', async () => {
      const { AccountModel, UserModel } = await database();

      const accountCreate = sinon.spy(AccountModel, 'create');
      const userCreate = sinon.spy(UserModel, 'create');

      const error = await auth({
        header: sinon.stub().returns(`token some-token`)
      } as any).catch((error) => error);

      expect(error.message).to.equal(`Token didn't match the expected format. "Bearer <token>"`);

      sinon.assert.notCalled(accountCreate);
      sinon.assert.notCalled(userCreate);
    });

    it('should support a authorization token not being provided', async () => {
      const { AccountModel, UserModel } = await database();

      const accountCreate = sinon.spy(AccountModel, 'create');
      const userCreate = sinon.spy(UserModel, 'create');

      const token = await auth({
        header: sinon.stub().withArgs('authorization').returns(undefined)
      } as any);

      expect(token).to.equal(null);

      sinon.assert.notCalled(accountCreate);
      sinon.assert.notCalled(userCreate);
    });
  });
});

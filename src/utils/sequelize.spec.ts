import * as sinon from 'sinon';
import { Sequelize } from 'sequelize-typescript';

import { chance } from './test/mock';
import { CreateDatabase } from './sequelize';

describe('Sequelize', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('function(CreateDatabase)', () => {
    it('should create a database if our dialect is not sqlite', async () => {
      const name = chance.string();

      const query = sinon.stub(Sequelize.prototype, 'query').resolves();

      await CreateDatabase('mysql://localhost', name);

      sinon.assert.calledOnce(query);
      sinon.assert.calledWithExactly(query, `CREATE DATABASE \`${name}\`;`);
    });

    it('should skip creating a database if our dialect is sqlite', async () => {
      const name = chance.string();

      const query = sinon.stub(Sequelize.prototype, 'query').resolves();

      await CreateDatabase('sqlite://:memory', name);

      sinon.assert.notCalled(query);
    });
  });
});

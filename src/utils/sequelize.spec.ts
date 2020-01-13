import * as sinon from 'sinon';
import { chance, database } from './test/mock';
import { CreateDatabase } from './sequelize';

describe('Sequelize', () => {
  describe('function(CreateDatabase)', () => {
    it('should create a database if our dialect is not sqlite', async () => {
      const name = chance.string();
      const sequelize = database();

      const query = sinon.stub(sequelize, 'query').resolves();
      sinon.stub(sequelize.options, 'dialect').get(() => 'mysql');

      await CreateDatabase(sequelize, name);

      sinon.assert.calledOnce(query);
      sinon.assert.calledWithExactly(query, `CREATE DATABASE ${name}`);
    });

    it('should skip creating a database if our dialect is sqlite', async () => {
      const name = chance.string();
      const sequelize = database();

      const query = sinon.stub(sequelize, 'query').resolves();

      await CreateDatabase(sequelize, name);

      sinon.assert.notCalled(query);
    });
  });
});

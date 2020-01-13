import { expect } from '@hapi/code';
import { safeParse } from './json';

describe('JSON', () => {
  describe('function(safeParse)', () => {
    it('should support json', () => {
      expect(safeParse(JSON.stringify({ hello: 'world' }))).equals({
        hello: 'world'
      });
    });

    it('should support strings', () => {
      expect(safeParse('hallo welt')).to.equal('hallo welt');
    });

    it('should support specifying a default value', () => {
      expect(safeParse('hallo welt', 'hello welt')).to.equal('hello welt');
    });
  });
});

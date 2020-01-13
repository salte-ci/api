import { expect } from '@hapi/code';
import { Base64 } from './convert';

describe('convert', () => {
  describe('Base64', () => {
    describe('function(encode)', () => {
      it('should encode utf8 strings to base64', async () => {
        expect(Base64.encode('hello world')).to.equal('aGVsbG8gd29ybGQ=');
      });
    });

    describe('function(decode)', () => {
      it('should decode base64 strings to utf8', async () => {
        expect(Base64.decode('aGVsbG8gd29ybGQ=')).to.equal('hello world');
      });
    });
  });
});

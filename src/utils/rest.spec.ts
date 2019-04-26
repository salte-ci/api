import { expect } from 'chai';
import { wrap, rest } from './rest';
import { HttpInterface } from '../routes/interface';

describe('Register', () => {
  describe('function(wrap)', () => {
    it('should support automatically wrapping async methods to work with express', (done) => {
      const wrappedMethod = wrap(async ({ body, params }) => {
        expect(body).to.deep.equal({ hello: 'world' });
        expect(params).to.deep.equal({ hallo: 'welt' });
      });

      // @ts-ignore
      wrappedMethod({
        body: {
          hello: 'world'
        },
        params: {
          hallo: 'welt'
        }
      }, {
        json: () => ({
          status: () => ({
            send: done
          })
        })
      }, done);
    });

    it('should support errors', (done) => {
      const wrappedMethod = wrap(async () => {
        throw new Error('Whoops!');
      });

      // @ts-ignore
      wrappedMethod({
        body: {
          hello: 'world'
        },
        params: {
          hallo: 'welt'
        }
      }, {}, (error: any) => {
        expect(error.message).to.equal('Whoops!');
        done();
      });
    });
  });

  describe('function(rest)', () => {
    it('should register the methods defined', () => {
      class CustomRoute implements HttpInterface<any> {
        public route = '/custom';

        public async get() {
          return {
            status: 'ok'
          };
        }

        public async post() {
          return {
            status: 'ok'
          };
        }

        public async put() {
          return {
            status: 'ok'
          };
        }

        public async delete() {}
      }

      const router = rest(new CustomRoute());

      expect(router.stack.length).to.equal(4);
      const [get, post, put, del] = router.stack;

      expect('/custom').to.match(get.regexp);
      expect(get.route.stack[0].method).to.equal('get');
      expect(post.route.stack[0].method).to.equal('post');
      expect(put.route.stack[0].method).to.equal('put');
      expect(del.route.stack[0].method).to.equal('delete');
    });

    it('should registering no methods', () => {
      class CustomRoute implements HttpInterface<any> {
        public route = '/custom';
      }

      const router = rest(new CustomRoute());

      expect(router.stack.length).to.equal(0);
    });
  });
});

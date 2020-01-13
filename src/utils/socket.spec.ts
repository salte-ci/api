import { Server } from 'http';
import * as getPort from 'get-port';
import { expect } from '@hapi/code';
import * as WebSocket from 'ws';
import { socket } from './socket';
import { SocketInterface } from '../sockets/interface';

function listen(server: Server, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      server.listen(port, () => resolve());
    } catch (error) {
      reject(error);
    }
  });
}

function close(server?: Server | WebSocket.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) server.close((error) => error ? reject(error) : resolve());
    else resolve();
  });
}

function open(socket: WebSocket) {
  return new Promise((resolve) => {
    socket.once('open', resolve);
  });
}

function send(socket: WebSocket, data: any, cb: (message: string) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.once('message', (message: string) => {
      try {
        cb(message);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    socket.send(data)
  });
}

describe('Register', () => {
  let port: number;
  let server: Server;
  let wss: WebSocket.Server;
  beforeEach(async () => {
    port = await getPort();
    server = new Server();
    await listen(server, port);
  });

  afterEach(async () => {
    await close(wss);
    await close(server);
  });

  describe('function(socket)', () => {
    it('should support the "basic" event', async () => {
      class CustomRoute implements SocketInterface<any> {
        public route = '/custom';

        public async basic() {
          return {
            hello: 'world'
          };
        }
      }

      wss = socket(server, new CustomRoute());

      const ws = new WebSocket(`ws://localhost:${port}/custom`);

      await open(ws);
      await send(ws, JSON.stringify(['basic']), (message: string) => {
        expect(JSON.parse(message)).equals([
          'basic',
          {
            hello: 'world'
          }
        ]);
      });
    });

    it('should support unknown events', async () => {
      class CustomRoute implements SocketInterface<any> {
        public route = '/custom';
      }

      wss = socket(server, new CustomRoute());

      const ws = new WebSocket(`ws://localhost:${port}/custom`);

      await open(ws);
      await send(ws, JSON.stringify(['basic']), (message) => {
        expect(JSON.parse(message)).equals([
          'basic',
          'Unknown Event. (basic)'
        ]);
      });

      await send(ws, JSON.stringify(['bogus']), (message) => {
        expect(JSON.parse(message)).equals([
          'bogus',
          'Payload was formatted incorrectly, please check the documentation to validate your request.'
        ]);
      });
    });

    it('should support other error formats', async () => {
      class CustomRoute implements SocketInterface<any> {
        public route = '/custom';

        public async basic() {
          return Promise.reject('Whoops!');
        }
      }

      wss = socket(server, new CustomRoute());

      const ws = new WebSocket(`ws://localhost:${port}/custom`);

      await open(ws);
      await send(ws, JSON.stringify(['basic']), (message) => {
        expect(JSON.parse(message)).equals([
          'basic',
          'Whoops!'
        ]);
      });
    });
  });
});

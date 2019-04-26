import * as http from 'http';
import * as WebSocket from 'ws';
import { validate } from '../schemas';
import { safeParse } from './json';
import { SocketInterface } from '../sockets/interface';

export interface Options {
  body: {
    [key: string]: any;
  };

  params: {
    [key: string]: string | number | boolean;
  };
}


export function socket(server: http.Server, route: SocketInterface<any>): WebSocket.Server {
  const wss = new WebSocket.Server({
    path: route.route,
    server
  });

  wss.on('connection', (socket) => {
    socket.on('message', async (message) => {
      const payload = safeParse(message);

      const [ event, data ] = payload;

      try {
        validate('sockets', payload);

        let response;
        if (route.basic) {
          response = await route.basic(data);
        } else {
          throw new Error(`Unknown Event. (${event})`);
        }

        socket.send(JSON.stringify([
          event,
          response
        ]));
      } catch (error) {
        socket.send(JSON.stringify([
          event,
          error.message || error
        ]));
      }
    });
  });

  return wss;
}

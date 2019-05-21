import { Server } from 'http';
import * as express from 'express';
import { config } from './shared/config';
import { rest } from './utils/rest';
import { socket } from './utils/socket';
import { RouteError } from './routes/interface';
import * as Routes from './routes/routes';
import * as Sockets from './sockets/sockets';

const app = express();

for (const [key, Route] of Object.entries(Routes)) {
  console.log(`Registering HTTP Route: ${key}...`);
  app.use(rest(new Route()));
}

const server = new Server(app);

for (const [key, Socket] of Object.entries(Sockets)) {
  console.log(`Registering WS Route: ${key}...`);
  socket(server, new Socket());
}

app.use((error: RouteError, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  let status = error.status ? error.status : 500;
  console.error(error.message);

  return response.status(status).json({
    message: error.message,
    code: error.code || 'internal_server_error',
    status: error.status || 500
  });
});

server.listen(config.PORT, () => {
  console.log(`Listening at: http://localhost:${config.PORT}`);
});

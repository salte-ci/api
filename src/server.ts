import PromiseRouter from 'express-promise-router';
import { Server } from 'http';
import { json, NextFunction, Request, Response } from 'express';
import { Server as OvernightServer } from '@overnightjs/core';
import { socket } from './utils/socket';
import { auth } from './utils/auth';
import { logger } from './shared/logger';
import * as Controllers from './controllers';
import * as Sockets from './sockets/sockets';

export class ExpressServer extends OvernightServer {
  public server: Server;

  public constructor() {
    super();

    this.app.use(json());
    this.app.use(async (req: any, res: Response, next: NextFunction) => {
      try {
        req.auth = await auth(req);
        next();
      } catch (error) {
        next(error);
      }
    });

    this.addControllers(Object.values(Controllers).map((Controller) => new Controller()), PromiseRouter);

    this.app.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
      logger.error(error);
      const status = error.status || 500;

      return response.status(status).json({
        message: error.message,
        code: error.code || 'internal_server_error',
        status
      });
    });

    this.server = new Server(this.app);

    for (const [key, Socket] of Object.entries(Sockets)) {
      logger.info(`Registering WS Route: ${key}...`);
      socket(this.server, new Socket());
    }
  }

  public listen(port: number): void {
    this.server.listen(port, () => {
      logger.info(`Started server on port: ${port}`);
    });
  }
}

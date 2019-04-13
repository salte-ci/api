import { RouteInterface } from './interface';

export interface Health {
  status: string;
};

export class HealthRoute implements RouteInterface<Health> {
  public route = '/health';

  public async get() {
    return {
      status: 'ok'
    };
  }
}

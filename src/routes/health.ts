import { HttpInterface } from './interface';

export interface Health {
  status: string;
};

export class HealthRoute implements HttpInterface<Health> {
  public route = '/health';

  public async get() {
    return {
      status: 'ok'
    };
  }
}

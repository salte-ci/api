import { RouteInterface, Options, RouteError } from './interface';
import { LinkModel } from '../models/database';

export interface Link {
  status: string;
};

export class LinkRoute implements RouteInterface<Link> {
  public route = '/link';

  public async get({ params }: Options<Link>) {
    if (params.id === undefined) {
      return LinkModel.findAll();
    }

    return LinkModel.findByPk(params.id);
  }

  public async post() {
    const link = await LinkModel.create({
      id: 'hello'
    });

    return link;
  }
}

import { HttpInterface, Options, RouteError } from './interface';
import { LinkModel } from '../models/database';

export interface Link {
  status: string;
};

export class LinkRoute implements HttpInterface<Link> {
  public route = '/link';

  public async get({ params }: Options) {
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

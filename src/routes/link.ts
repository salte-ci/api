import { HttpInterface, Options } from './interface';
import { database } from '../models/database';

export interface Link {
  status: string;
};

export class LinkRoute implements HttpInterface<Link> {
  public route = '/link';

  public async get({ params }: Options) {
    const { LinkModel } = await database();

    if (params.id === undefined) {
      return LinkModel.findAll();
    }

    return LinkModel.findByPk(params.id);
  }

  public async post() {
    const { LinkModel } = await database();

    const link = await LinkModel.create({
      id: 'hello'
    });

    return link;
  }
}

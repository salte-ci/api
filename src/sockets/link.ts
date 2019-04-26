import { SocketInterface, Options, SocketError } from './interface';

export interface Link {
  status: string;
};

export class LinkSocket implements SocketInterface<Link> {
  public route = '/link';

  async basic(data: Link) {
    return data;
  }
}

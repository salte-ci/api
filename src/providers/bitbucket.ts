import * as request from 'superagent';
import * as Bitbucket from 'bitbucket';

import { config } from '../shared/config';
import { Base64 } from '../utils/convert';
import { Provider } from './interface';

export class BitbucketProvider extends Provider {
  public bitbucket: Bitbucket;

  constructor(url: string, token: string) {
    super();
    this.bitbucket = new Bitbucket({
      baseUrl: `${url}/2.0`
    });

    this.bitbucket.authenticate({
      type: 'token',
      token
    });
  }

  static async token(options: Provider.TokenOptions): Promise<Provider.TokenResponse> {
    const response = await request.post(`${options.url}/site/oauth2/access_token`)
      .type('form')
      .set('Authorization', `Basic ${Base64.encode(`${options.client_id}:${options.client_secret}`)}`)
      .field('grant_type', 'authorization_code')
      .field('code', options.code)
      .field('redirect_uri', config.PROVIDER_REDIRECT_URI);

    return {
      access_token: response.body.access_token,
      refresh_token: response.body.refresh_token
    };
  }

  async validate(): Promise<void> {
    await this.bitbucket.users.getAuthedUser({});
  }
}

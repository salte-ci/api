import * as request from 'superagent';
import GitLab from 'gitlab';

import { Provider } from './interface';
import { config } from '../shared/config';

export class GitLabProvider extends Provider {
  public gitlab: any;

  constructor(url: string, token: string) {
    super();
    this.gitlab = new GitLab({
      url,
      oauthToken: token
    });
  }

  static async token(options: Provider.TokenOptions): Promise<Provider.TokenResponse> {
    const response = await request.post(`${options.url}/oauth/token`).send({
      client_id: options.client_id,
      client_secret: options.client_secret,
      code: options.code,
      grant_type: 'authorization_code',
      redirect_uri: config.PROVIDER_REDIRECT_URI
    });

    return {
      access_token: response.body.access_token,
      refresh_token: response.body.refresh_token
    };
  }

  async validate(): Promise<void> {
    await this.gitlab.Users.current();
  }
}

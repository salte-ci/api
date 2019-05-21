import * as request from 'superagent';
import * as Octokit from '@octokit/rest';

import { Provider } from './interface';

export class GitHubProvider extends Provider {
  public octokit: Octokit;

  constructor(url: string, token: string) {
    super();
    this.octokit = new Octokit({
      baseUrl: url,
      auth: token
    });
  }

  static async token(options: Provider.TokenOptions): Promise<Provider.TokenResponse> {
    const response = await request.post(`${options.url}/login/oauth/access_token`).send({
      client_id: options.client_id,
      client_secret: options.client_secret,
      code: options.code
    });

    return {
      access_token: response.body.access_token
    };
  }

  async validate(): Promise<void> {
    await this.octokit.users.getAuthenticated();
  }
}

import * as Octokit from '@octokit/rest';
import * as JWT from 'jsonwebtoken';

import { fetch } from '../utils/fetch';
import { Provider } from './interface';

export class GitHubProvider extends Provider {
  private token: string;
  public octokit: Octokit;

  constructor(url: string, token: string) {
    super();
    this.token = token;
    this.octokit = new Octokit({
      baseUrl: url,
      auth: this.token
    });
  }

  static jwt(appID: string, privateKey: string): string {
    const now = Math.floor(Date.now() / 1000);
    return JWT.sign({
      iat: now,
      exp: now + (10 * 60),
      iss: appID
    }, privateKey, { algorithm: 'RS256'});
  }

  static async token(options: Provider.UserTokenOptions | Provider.AppTokenOptions): Promise<Provider.TokenResponse> {
    try {
      if (options.private_key) {
        const octokit = new Octokit({
          baseUrl: options.url,
          auth: this.jwt(options.app_id, options.private_key)
        });

        const { data } = await octokit.apps.createInstallationToken({
          installation_id: options.installation_id
        });

        return {
          access_token: data.token
        };
      } else {
        const response = await fetch(`${options.url}/login/oauth/access_token`, {
          method: 'post',
          headers: {
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: options.client_id,
            client_secret: options.client_secret,
            code: options.code
          })
        });

        return {
          access_token: response.access_token
        };
      }
    } catch (error) {
      console.error(error);
      throw error.body;
    }
  }

  async validate(): Promise<void> {
    if (this.token.startsWith('v1.')) {
      await this.octokit.apps.listRepos({
        per_page: 1
      });
    } else {
      await this.octokit.users.getAuthenticated();
    }
  }

  async listReposForApp(): Promise<Provider.RepositoryResponse[]> {
    const { data } = await this.octokit.apps.listRepos();

    return data.repositories.map((repository) => ({
      slug: repository.full_name,
      private: repository.private
    }));
  }
}

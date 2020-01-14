export class Provider {
  static async token(_options: Provider.UserTokenOptions | Provider.AppTokenOptions): Promise<Provider.TokenResponse> {
    throw new Error('Method not implemented.');
  }
}

export interface Provider {
  validate(): Promise<void>;
  listReposForApp(): Promise<Provider.RepositoryResponse[]>;
}

export declare namespace Provider {
  export interface TokenOptions {
    [key: string]: any;
    url: string;
  }

  export interface UserTokenOptions extends TokenOptions {
    client_id: string;
    client_secret: string;
    code: string;
  }

  export interface AppTokenOptions extends TokenOptions {
    private_key: string;
    app_id: number;
    installation_id: number;
  }

  export interface TokenResponse {
    access_token: string;
    refresh_token?: string;
  }

  export interface RepositoryResponse {
    slug: string;
    private: boolean;
  }
}

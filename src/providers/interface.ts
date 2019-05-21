export class Provider {
  static async token(_options: Provider.TokenOptions): Promise<Provider.TokenResponse> {
    throw new Error('Method not implemented.');
  }
}

export interface Provider {
  validate(): Promise<void>;
}

export declare namespace Provider {
  export interface TokenOptions {
    url: string;
    client_id: string;
    client_secret: string;
    code: string;
  }

  export interface TokenResponse {
    access_token: string;
    refresh_token?: string;
  }
}

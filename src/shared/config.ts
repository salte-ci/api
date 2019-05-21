import 'dotenv/config';

export interface DefaultProviderConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
};

export interface Config {
  DATABASE_URL: string;

  JWKS_URL: string;
  ISSUER: string;
  AUDIENCE: string;

  PROVIDER_REDIRECT_URI?: string;
  DEFAULT_GITHUB_PROVIDER?: DefaultProviderConfig;
  DEFAULT_BITBUCKET_PROVIDER?: DefaultProviderConfig;
  DEFAULT_GITLAB_PROVIDER?: DefaultProviderConfig;

  /**
   * The Port to run the server on.
   */
  PORT: number;

  LOG_LEVEL: string;

  ENVIRONMENT: string;
};

const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite://:memory',
  JWKS_URL: process.env.JWKS_URL || 'https://salte.auth0.com/.well-known/jwks.json',
  ISSUER: process.env.ISSUER || 'https://salte.auth0.com/',
  AUDIENCE: process.env.AUDIENCE || 'https://api.alpha.salte.ci',

  PROVIDER_REDIRECT_URI: process.env.PROVIDER_REDIRECT_URI,

  DEFAULT_GITHUB_PROVIDER: process.env.DEFAULT_GITHUB_PROVIDER_CLIENT_ID && process.env.DEFAULT_GITHUB_PROVIDER_CLIENT_SECRET ? {
    CLIENT_ID: process.env.DEFAULT_GITHUB_PROVIDER_CLIENT_ID,
    CLIENT_SECRET: process.env.DEFAULT_GITHUB_PROVIDER_CLIENT_SECRET
  } : undefined,

  DEFAULT_BITBUCKET_PROVIDER: process.env.DEFAULT_BITBUCKET_PROVIDER_CLIENT_ID && process.env.DEFAULT_BITBUCKET_PROVIDER_CLIENT_SECRET ? {
    CLIENT_ID: process.env.DEFAULT_BITBUCKET_PROVIDER_CLIENT_ID,
    CLIENT_SECRET: process.env.DEFAULT_BITBUCKET_PROVIDER_CLIENT_SECRET
  } : undefined,

  DEFAULT_GITLAB_PROVIDER: process.env.DEFAULT_GITLAB_PROVIDER_CLIENT_ID && process.env.DEFAULT_GITLAB_PROVIDER_CLIENT_SECRET ? {
    CLIENT_ID: process.env.DEFAULT_GITLAB_PROVIDER_CLIENT_ID,
    CLIENT_SECRET: process.env.DEFAULT_GITLAB_PROVIDER_CLIENT_SECRET
  } : undefined,

  PORT: Number(process.env.PORT) || 8080,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENVIRONMENT: process.env.ENVIRONMENT || 'local'
};

export { config };

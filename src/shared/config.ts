import 'dotenv/config';
import { safeReadFileSync } from '../utils/fs';

export interface DefaultProviderConfig {
  name: string;
  friendly_name: string;
  type: string;
  url: string;
  api_url: string;
  client_id: string;
  client_secret: string;
};

export interface Config {
  DATABASE_URL: string;

  JWKS_URL: string;
  ISSUER: string;
  AUDIENCE: string;

  PROVIDER_REDIRECT_URI?: string;
  DEFAULT_PROVIDERS: DefaultProviderConfig[];

  /**
   * The Port to run the server on.
   */
  PORT: number;

  LOG_LEVEL: string;

  ENVIRONMENT: string;
};

export function env(name: string, defaultValue?: any): any {
  const value = process.env[name.toUpperCase()] ||
    safeReadFileSync(`/run/secrets/${name.toLowerCase()}`, 'utf8') ||
    defaultValue;

  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  return null;
}

const config: Config = {
  DATABASE_URL: env('DATABASE_URL', 'sqlite://:memory'),
  JWKS_URL: env('JWKS_URL', 'https://salte.auth0.com/.well-known/jwks.json'),
  ISSUER: env('ISSUER', 'https://salte.auth0.com/'),
  AUDIENCE: env('AUDIENCE', 'https://api.alpha.salte.ci'),

  PROVIDER_REDIRECT_URI: env('PROVIDER_REDIRECT_URI', 'http://localhost:8081'),

  DEFAULT_PROVIDERS: env('DEFAULT_PROVIDERS') || [],

  PORT: Number(env('PORT', 8080)),
  LOG_LEVEL: env('LOG_LEVEL', 'info'),
  ENVIRONMENT: env('ENVIRONMENT', 'local')
};

export { config };
